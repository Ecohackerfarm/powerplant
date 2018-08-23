/**
 * @namespace locationActions
 * @memberof client.actions
 */

const axios = require('axios');
const { editLocation, addLocation, deleteLocation, setLocations } = require('.');
const { simpleAuthCheckedRequest } = require('./actionHelpers');
const { getLocations } = require('../../shared/api-client.js');

/**
 * Async sends a request to get all the user's locations
 * On response, dispatches a {@link client.actions.setLocationsAction setLocationsAction}
 * Does nothing if not authenticated
 * @function
 * @param  {String} id id of user whose locations are being fetched
 * @return {Promise}    the network request
 */
const getLocationsRequest = id => {
	return dispatch =>
	  getLocations({id})
	    .then(res => {
				dispatch(setLocations(res.data));
		}).catch(error => {
				console.log('Unhandled Error:',error);
		});
};

/**
 * Async sends a request to save a location, dispatches an {@link client.actions.addLocationAction addLocationAction}
 * on success
 * @function
 * @param  {server.models.Location} location unlike server model, does not require an _id parameter
 * @return {Promise} resolves to a {@link client.actions.responseObject}
 */
const saveLocationRequest = location => {
	return (dispatch,getState) => {
		if (getState().auth.isAuthenticated) {
			return axios.post('/api/locations', location).then(res => {
				if (res.status === 201) {
					dispatch(addLocation({ [res.data._id] : res.data }));
					return { success: true };
				} else {
					return Object.assign({}, res.data, { success: false });
				}
			});
		} else {
			// in LocationItem we specified that locations need ids
			// we should make this look the same as a mongodb location item
			// user is not authenticated so we will just save it to redux
			// returning a promise so it looks the same to the component that
			// called it as if it had been a server request
			return new Promise(resolve => {
				const currentLocations = getState().locations;
				let newId = 0;
				//test if id is not already taken
				while(currentLocations[newId] !== undefined){
					newId++;
				}
				location._id = newId.toString();
				dispatch(addLocation({ [location._id] : location }));
				resolve({
					success: true
				});
			});
		}
	};
};

// since we are only just posting these to the server, these locations could possibly not have valid ids yet
// if it doesn't, we need to change its id once saved (in the reducer)
/**
 * Async makes a request to save an array of locations on the server, then updates them in the store if successful by
 * dispatching {@link client.actions.editLocationAction editLocationAction} requests
 * @function
 * @param  {server.model.Location[]} locations locations to be saved
 * @return {Promise} resolves to a {@link client.actions.responseObject}
 */
const saveAllLocationsRequest = locations => {
	return dispatch => {
		const oldLocations = Object.assign({}, locations); // make a copy
		const requests = Object.entries(locations).map(
			({key, loc}) => axios.post('/api/locations', loc)
		);
		return Promise.all(requests).then(results => {
			let success = true;
			results.forEach((res, i) => {
				if (res.status === 200) {
					// if success, update to have the object id
					dispatch(editLocation(oldLocations[i], res.data));
				} else {
					success = false;
				}
			});
			return { success };
		});
	};
};

/**
 * Async make a request to update a location. Dispatch an {@link client.actions.editLocationAction} on success
 * @function
 * @param  {ObjectId|String} id     id of the location to edit. Mongoose ObjectId if authenticated, string if not
 * @param  {Object} locChanges changes to be made to the location
 * @return {client.actions.responseObject}
 */
const editLocationRequest = (id, locChanges) => {
	return simpleAuthCheckedRequest(
		'/api/locations/' + id,
		'put',
		editLocation,
		id,
		locChanges
	);
};

const deleteLocationRequest = id => {
	return simpleAuthCheckedRequest(
		'/api/locations/' + id,
		'delete',
		deleteLocation,
		id
	);
};

module.exports = {
	getLocationsRequest,
	saveLocationRequest,
	saveAllLocationsRequest,
	editLocationRequest,
	deleteLocationRequest
};
