import React from 'react';
import {Route} from 'react-router-dom';
import Hello from './Hello';
import Login from './login/Login';
import Register from './login/Register';
import Recover from './login/Recover';


class Main extends React.Component {
  render() {
    return (
      <div>
        <Route path="/" component={Hello} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/recover" component={Recover} />
      </div>
    )
  }
}

export default Main;
