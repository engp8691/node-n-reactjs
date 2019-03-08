import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Register from './components/Register';
import TodoList from './components/TodoList';
import Login from './components/Login';

class App extends Component {
  render () {
    return (
      <div>
          <Switch>
            <Route path="/todolist" component={TodoList} />
            <Route path="/register" component={Register} />
            <Route path="/" exact component={Login} />
          </Switch>
      </div>
    );
  }
}

export default App;

