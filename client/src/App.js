import logo from './logo.svg';
import './App.css';
import { Link, Route, BrowserRouter, Routes } from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './OtherPage';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
					</p>
					<Link to="/">Home</Link>
					<Link to="/otherPage">other Page</Link>
				</header>
				<div>
					<Routes>
						<Route exact path="/" element={<Fib />}></Route>
						<Route path="/otherPage" element={<OtherPage />}></Route>
					</Routes>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
