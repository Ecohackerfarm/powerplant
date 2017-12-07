/**
 * @namespace client
 */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import reducer from './rootReducer';
import { setUserFromToken } from '/client/actions/userActions';
import { addAllStyles } from './styles/bootstrapCustomStyles';
import App from './components/App';

import '/client/styles/main.scss';

// adding in our bootstrap custom styles
addAllStyles();

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
);

// jwtToken is loaded and saved to localStorage, but there's no reason not to switch this to the persistent
// redux store. i just haven't gotten to it. pretty sure redux-persist uses localStorage anyway

class AppProvider extends React.Component {
	state = {
		rehydrated: false
	};

	componentWillMount() {
		persistStore(store, {}, () => {
			this.setState({ rehydrated: true });
		});

		if (localStorage.jwtToken) {
			store.dispatch(setUserFromToken(localStorage.jwtToken));
		}
	}

	render() {
		if (!this.state.rehydrated) {
			return <div>Loading...</div>;
		}
		return (
			<Provider store={store}>
				<Router>
					<App />
				</Router>
			</Provider>
		);
	}
}

render(<AppProvider />, document.getElementById('app'));
