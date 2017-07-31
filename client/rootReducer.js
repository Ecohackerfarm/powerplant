import { combineReducers } from 'redux';
import * as reducers from './reducers';

// this is not used, but it's nice as a reminder
const initialState = {
	title: 'powerplant',
	auth: {
		isAuthenticated: false,
		currentUser: null
	},
	currLocation: null,
	locations: [],
	beds: [],
	crops: [],
	cropInfos: [],
	cropRelationships: []
};

export default combineReducers({ ...reducers });
