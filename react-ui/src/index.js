import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Register from './components/Register';
import TodoList from './components/TodoList';
import Login from './components/Login';

import combinedReducer from './reducers';

const store = createStore(combinedReducer);

const app = (
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<Route path="/todolist" component={TodoList} />
				<Route path="/register" component={Register} />
				<Route path="/" exact component={Login} />
			</Switch>
		</BrowserRouter>
	</Provider>
);

ReactDOM.render( app, document.getElementById( 'root' ) );

