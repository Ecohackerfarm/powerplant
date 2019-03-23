/**
 * Client-side code
 * 
 * @namespace client
 */

const React = require('react');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
//const { addAllStyles } = require('./styles');
const App = require('./components/App');
const { createLogger } = require('redux-logger');
const thunk = require('redux-thunk').default;
const reducer = require('./reducers');
const { createStore, compose, applyMiddleware } = require('redux');
const { persistStore, autoRehydrate } = require('redux-persist');
const { storeLoaded } = require('./actions');
const { BrowserRouter } = require('react-router-dom');
require('./styles/main.scss');

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
//addAllStyles();

render(<AppProvider />, document.getElementById('app'));
