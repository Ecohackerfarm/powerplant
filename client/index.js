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
import store from './store'
import { BrowserRouter } from 'react-router-dom';
import '/client/styles/main.scss';

// Add custom styles for React-Bootstrap components
addAllStyles();

// jwtToken is loaded and saved to localStorage, but there's no reason not to switch this to the persistent
// redux store. i just haven't gotten to it. pretty sure redux-persist uses localStorage anyway

class AppProvider extends React.Component {

	render() {
		return (
			<Provider store={store}>
			  <BrowserRouter>
   			  <App storeIsLoaded={false} store={store} />
   			</BrowserRouter>
			</Provider>
		);
	}
}

render(<AppProvider />, document.getElementById('app'));
