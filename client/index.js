/**
 * Client-side code
 * 
 * @namespace client
 */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { addAllStyles } from './styles';
import App from './components/App';
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk';
import reducer from './reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { storeLoaded } from './actions'
import { BrowserRouter } from 'react-router-dom';
import '/client/styles/main.scss';

/**
 * The root component of the application. Everything unfolds from here.
 * Main job of this component is to make the Redux store available for
 * connect() calls.
 * 
 * @extends Component
 */
class AppProvider extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
   					<App storeLoaded={false} />
   				</BrowserRouter>
			</Provider>
		);
	}
}

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

// Create the Redux store
const store = createReduxStore();

// Add custom styles for React-Bootstrap components
addAllStyles();

render(<AppProvider />, document.getElementById('app'));
