const keys = require("./keys")
const express = require("express")
const redis = require("redis")
const bodyparser = require("body-parser")
const cors = require("cors")
const { Pool } = require("pg")

const app = express();
app.use(cors());
app.use(bodyparser.json());

// create PostGress connection
const pgClient = new Pool({
	host: keys.pgHost,
	port: keys.pgPort,
	database: keys.pgDatabase,
	user: keys.pgUser,
	password: keys.pgPassword
});

pgClient.on("error", (error) => console.log('Lost PG connection', error));

pgClient.on("connect", (client) => {
	client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
		.catch(err => console.log(err));
});

// redis CLient setup
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

app.get("/", (req, res) => {
	res.send("Hi All!");
})

app.get("/values/all", async (req, res) => {
	const values = await pgClient.query("SELECT * FROM VALUES");

	res.send(values.rows);
});

app.get("/values/current", (req, res) => {
	redisClient.hgetall("values", (err, values) => {
		console.log(values)
		res.send(values);
	})
});

app.post("/values", async (req, res) => {
	console.log("req ->", req)
	const index = req.body.index;

	console.log("index -> ", index)

	if (parseInt(index) > 40) {
		return res.status(422).send("index too high")
	}

	redisClient.hset("values", index, "Nothing yet!");
	redisPublisher.publish("insert", index);

	pgClient.query("INSERT INTO VALUES(NUMBER) VALUES ($1)", [index]);

	res.send({ working: true });
})

app.listen(5000, () => {
	console.log('listening on port 8081');
})

