/**
 * @namespace cropActions
 * @memberof client.actions
 */

const { getCropsByName, getUpdates } = require('../../shared/api-client.js');
const {
	cropsLoading,
	cropsUpdated,
	cropsLoadingError,
	cropRelationshipsLoading,
	cropRelationshipsUpdated,
	cropRelationshipsLoadingError,
	versionUpdated
} = require('.');

/**
 * Fetches crops from server if not existent or old data
 * @function
 * @return {Function}		function for dispatch
 */
const fetchCrops = () => {
	return (dispatch, getState) => {
		dispatch(cropsLoading(true));
		return getUpdates(getState().version)
			.then(result => {
				const updates = result.data;
				if (updates.hasOwnProperty('crops')) {
					dispatch(cropsUpdated(updates.crops.crops));
					dispatch(versionUpdated({ crops: updates.crops.version }));
				}
				dispatch(cropsLoading(false));
			}).catch(error => {
				dispatch(cropsLoadingError(error));
				dispatch(cropsLoading(false));
			});
	};
};

module.exports = {
	fetchCrops
};
