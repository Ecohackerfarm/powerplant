import React from 'react';
import Header from './header/Header';
import Main from './Main';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

class App extends React.Component {

  static propTypes = {
    authenticated: PropTypes.bool.isRequired
  }

  render() {
    return (
      <div>
        <Header authenticated={this.props.authenticated} />
        <Main />
      </div>
    )
  }
}

const stateToProps = (state) => ({
  authenticated: state.auth.isAuthenticated
});

export default withRouter(connect(stateToProps)(App));
