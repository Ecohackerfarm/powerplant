import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Hello from './Hello';
import Login from './login/LoginPage';
import Register from './register/RegisterPage';
import Recover from './recover/Recover';
import LocationsPage from './locations/LocationsPage';
import PropTypes from 'prop-types';


class Main extends React.Component {

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={() => <Hello auth={this.props.auth} />} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/recover" component={Recover} />
          <Route path="/locations" component={LocationsPage} />
        </Switch>
      </div>
    )
  }
}

export default Main;
