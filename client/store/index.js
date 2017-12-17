import {createLogger } from 'redux-logger'
import thunk from 'redux-thunk';
import reducer from '../rootReducer';
import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { storeIsLoaded } from '../actions/appActions'

// create logger
const logger = createLogger();

// creating the redux store
const store = createStore(
	reducer,
	undefined,
	compose(
		// thunk allows for asynchronous actions
		applyMiddleware(thunk),
		// adding redux-persist functionality
		autoRehydrate(),
		// adding logging functionality
		applyMiddleware(logger),
	)
);

persistStore(store, {}, () => {
		store.dispatch(storeIsLoaded());
	}
);

export default store;
