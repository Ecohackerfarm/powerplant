/**
 * @namespace App
 * @memberof client
 */

const Header = require('./views/Header');
const React = require('react');
const { connect } = require('react-redux');
const { withRouter, Switch, Route, Redirect } = require('react-router-dom');
const CropsPage = require('./CropsPage.js');
const AboutPage = require('./AboutPage.js');

/**
 *
 */
class App extends React.Component {
  render() {
    if (!this.props.storeLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <Header />
          <div>
            <Switch>
              <Route
                path="/"
                exact={true}
                render={() => <Redirect to="/about" />}
              />
              <Route path="/crops" component={CropsPage} />
              <Route path="/about" component={AboutPage} />
            </Switch>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  storeLoaded: state.app.storeLoaded
});

module.exports = withRouter(
  connect(
    mapStateToProps,
    null
  )(App)
);
