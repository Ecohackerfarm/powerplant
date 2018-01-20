import axios from 'axios';
import {
	loadingCrops,
	recieveCrops,
	fetchCropsError,
	loadingRelationships,
	recieveRelationships,
	fetchRelationshipsError
} from '.';

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
export const fetchCrops = () => {
	const name = '';
	const index = '';
	const length = '';

  	// some intelligent update mechanism should be here but
	// instead we set an update interval
	
	return ( dispatch , getState ) => {
		if ( updateNeeded(getState().crops.relationshipsUpdated) ){
			dispatch(loadingCrops(true));
			return axios.get(
			  '/api/get-crops-by-name?name='
				+ name
				+ '&index='
				+ index
				+ '&length='
				+ length
			).then(res => {
				if (res.status === 200) {
					dispatch(recieveCrops(res.data));
				} else {
					dispatch(fetchCropsError(res));
				}
				dispatch(loadingCrops(false));
				//return {res};
			});
		}
	};
};

export const fetchRelationships = () => {
	return ( dispatch , getState ) => {
		if ( updateNeeded(getState().crops.companionships.updated) ){
			dispatch(loadingRelationships(true));
			return axios.get(
			  '/get-all-crop-relationships'
			).then(res => {
				if (res.status === 200) {
					dispatch(recieveRelationships(res.data));
				} else {
					dispatch(fetchRelationshipsError(res));
				}
				dispatch(loadingRelationships(false));
				//return {res};
			});
		}
	};
};
