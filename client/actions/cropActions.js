import axios from 'axios';
import {
	UPDATED_CROPS,
	UPDATED_RELATIONSHIPS,
	UPDATE_CROPS_ERROR,
	LOADING_CROPS,
	LOADING_RELATIONSHIPS,
	UPDATED_RELATIONSHIPS_ERROR
} from './types'

/**
 * Creates the action object with data for UPDATED_CROPS_ERROR
 * @param  {object} res response object from failed API CALL
 * @return {object}     action object
 */
const fetchCropsError = (res) => {
	return {
		type : UPDATE_CROPS_ERROR,
		respone: res
	}
}

/**
 * Creates the action object with data for UPDATED_RELATIONSHIPS
 * @param  {object} res response object from failed API CALL
 * @return {object}     action object
 */
const fetchRelationshipsError = (res) => {
	return {
		type : UPDATED_RELATIONSHIPS_ERROR,
		respone: res
	}
}

/**
 * Creates the action object with data for UPDATED_CROPS
 * reducer
 * @function
 * @param  {object} data data object form API call
 * @return {object}      action object
 */
const recieveCrops = (data) => {
	return {
		type : UPDATED_CROPS,
		all : data,
		updated : (new Date()).getTime()
	}
}

/**
 * Creates the action object with data for UPDATED_RELATIONSHIPS
 * reducer
 * @function
 * @param  {object} data data object form API call
 * @return {object}      action object
 */
const recieveRelationships = (data) => {
	return {
		type : UPDATED_RELATIONSHIPS,
		relationships : data,
		relationshipsUpdated : (new Date()).getTime()
	}
}

const loadingCrops = (started) => {
	return {
		type : LOADING_CROPS,
		loading: started
	}
}

const loadingRelationships = (started) => {
	return {
		type : LOADING_RELATIONSHIPS,
		loading: started
	}
}

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
