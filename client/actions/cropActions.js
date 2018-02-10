/**
 * @namespace cropActions
 * @memberof client.actions
 */

const axios = require('axios');
const { getCropsByName } = require('../utils/apiCalls');
const {
	cropsLoading,
	cropsUpdated,
	cropsLoadingError,
	cropRelationshipsLoading,
	cropRelationshipsUpdated,
	cropRelationshipsLoadingError
} = require('.');


/**
 * decides if an update is needed
 * TODO: is still dumb and doesn't make decisions
 * @param  {number} lastUpdated millisec from the date of the last update
 * @return {boolean}             true if update is neccessary, false if not
 */
const updateNeeded = (lastUpdated) => {
	const now = new Date();
	const updateInterval = 7 * 24 * 60 * 60 * 1000;
	lastUpdated = 0; // HACK BEFORE INTELLIGENT UPDATE MECHANISM
	return ( now.getTime() - lastUpdated) > updateInterval
}

/**
 * Fetches crops from server if not existent or old data
 * @function
 * @return {Function}		function for dispatch
 */
const fetchCrops = () => {
	const name = '';
	const index = '';
	const length = '';

  	// some intelligent update mechanism should be here but
	// instead we set an update interval
	
	return (dispatch, getState) => {
		if (updateNeeded(getState().crops.relationshipsUpdated)) {
			dispatch(cropsLoading(true));
			return getCropsByName({ name, index, length }).then(res => {
				dispatch(cropsUpdated(res.data));
				dispatch(cropsLoading(false));
			}).catch(error => {
				dispatch(cropsLoadingError(error));
				dispatch(cropsLoading(false));
			});
		}
	};
};

/**
 * Fetches Relationship from server if not existent or old data
 * @return {function} function for dispatch
 */
const fetchRelationships = () => {
	return (dispatch, getState) => {
		if (updateNeeded(getState().crops.companionships.updated)) {
			dispatch(cropRelationshipsLoading(true));
			return axios.get(
			  '/get-all-crop-relationships'
			).then(res => {
				if (res.status === 200) {
					dispatch(cropRelationshipsUpdated(res.data));
				} else {
					dispatch(cropRelationshipsLoadingError(res));
				}
				dispatch(cropRelationshipsLoading(false));
			});
		}
	};
};

module.exports = {
	fetchCrops,
	fetchRelationships
};
