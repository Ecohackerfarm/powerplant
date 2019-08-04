/**
 * @namespace store
 * @memberof client.redux
 */

const { createStore, compose, applyMiddleware } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');
const { createLogger } = require('redux-logger');
const thunk = require('redux-thunk').default;
const reducer = require('./reducers.js');
const { storeLoaded } = require('./actions.js');

/**
 * Create the Redux store.
 *
 * @return {Object} Redux store
 */
function createReduxStore() {
  const logger = createLogger();
  const persistedReducer = persistReducer(
    {
      key: 'powerplant',
      storage: require('localforage')
    },
    reducer
  );
  const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    compose(
      // Thunk allows for asynchronous actions
      applyMiddleware(thunk),
      // Adding logging functionality
      applyMiddleware(logger)
    )
  );

  persistStore(store, {}, () => {
    store.dispatch(storeLoaded());
  });

  return store;
}

const store = createReduxStore();

module.exports = store;
