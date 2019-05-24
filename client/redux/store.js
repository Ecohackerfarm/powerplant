/**
 * @namespace store
 * @memberof redux
 */

const { createStore, compose, applyMiddleware } = require('redux');
const { persistStore, autoRehydrate } = require('redux-persist');
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
	const store = createStore(
		reducer,
		undefined,
		compose(
			// Thunk allows for asynchronous actions
			applyMiddleware(thunk),
			// Adding redux-persist functionality
			autoRehydrate(),
			// Adding logging functionality
			applyMiddleware(logger),
		)
	);

	persistStore(store, {}, () => {
		store.dispatch(storeLoaded());
	});

	return store;
}

const store = createReduxStore();

module.exports = store;
