import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import AddPoll from './Components/AddPoll';
import Admin from './Components/Admin';
import PollsDetails from './Components/PollsDetails';
import RequestVoter from './Components/RequestVoter';
import VerifyVoter from './Components/VerifyVoter';
import PoolingStation from './Components/PoolingStation';
import Home from './Components/Home';

import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<Route exact path='/' component={Home} />
			<Route exact path='/AddPoll' component={AddPoll} />
			<Route exact path='/PollsDetails' component={PollsDetails} />
			<Route exact path='/RequestVoter' component={RequestVoter} />
			<Route exact path='/VerifyVoter' component={VerifyVoter} />
			<Route exact path='/PoolingStation' component={PoolingStation} />
			<Route exact path='/Admin' component={Admin} />		
		</Switch>
	</Router>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
