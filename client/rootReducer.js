import {combineReducers} from 'redux';
import * as reducers from './reducers';

const initialState = {
  title: "powerplant",
  auth: {
    isAuthenticated: false,
    currentUser: null
  },
  currLocation: null,
  beds: [],
  crops: [],
  cropInfos: [],
  cropRelationships: [],

}

export default combineReducers({...reducers});
