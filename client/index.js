import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import reducer from './rootReducer';

import App from './components/App';

// create redux store
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

render((
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>
), document.getElementById('app'));
