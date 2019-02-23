/**
 * @namespace cropActions
 * @memberof client.actions
 */

const { getCropsByName } = require('../../shared/api-client.js');
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

module.exports = {
	fetchCrops
};
