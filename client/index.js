/**
 * @namespace client
 */

import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk';
import reducer from './rootReducer';
import {setUserFromToken} from '/client/actions/userActions';
import {addAllStyles} from './styles/bootstrapCustomStyles';
import App from './components/App';

import '/client/styles/main.scss';

// adding in our bootstrap custom styles
addAllStyles();
console.log("added styles");

// creating the redux store
export const store = createStore(
  reducer,
  undefined,
  compose(
    // thunk allows for asynchronous actions
    applyMiddleware(thunk),
    // adding redux-persist functionality
    autoRehydrate()
  )
)
// setting up redux-persist to save our redux store locally
persistStore(store)

// jwtToken is loaded and saved to localStorage, but there's no reason not to switch this to the persistent
// redux store. i just haven't gotten to it. pretty sure redux-persist uses localStorage anyway
if (localStorage.jwtToken) {
  store.dispatch(setUserFromToken(localStorage.jwtToken));
}

render((
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>
), document.getElementById('app'));
