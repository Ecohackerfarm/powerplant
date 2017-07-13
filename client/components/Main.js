import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Hello from './Hello';
import Login from './login/Login';
import Register from './register/Register';
import Recover from './recover/Recover';


class Main extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Hello} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/recover" component={Recover} />
        </Switch>
      </div>
    )
  }
}

export default Main;
