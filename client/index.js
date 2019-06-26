/**
 * Client-side code
 *
 * @namespace client
 */

const React = require('react');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
//const { addAllStyles } = require('./styles');
const App = require('./App');
const { BrowserRouter } = require('react-router-dom');
const store = require('./redux/store.js');
require('./styles/main.scss');
require('./worker/WorkerManager.js');

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

// Add custom styles for React-Bootstrap components
//addAllStyles();

render(<AppProvider />, document.getElementById('app'));
if (process.env.NODE_ENV === 'development' && module.hot) {
	module.hot.accept('./App', () => {
		render(<AppProvider />, document.getElementById('app'));
	});
}
