import axios from 'axios';
import {
	UPDATED_CROPS,
	UPDATE_CROPS_ERROR,
	LOADING_CROPS
} from './types'

/**
 * Creates the action object with data for UPDATED_CROPS_ERROR
 * @param  {object} res response object from failed API CALL
 * @return {object}     action object
 */
const fetchError = (res) => {
	return {
		type : UPDATE_CROPS_ERROR,
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
	console.log('DATA:'+ data);
	return {
		type : UPDATED_CROPS,
		all : data,
		updated : (new Date()).getTime()
	}
}

const loadingCrops = (started) => {
	return {
		type : LOADING_CROPS,
		loading: started
	}
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
  const now = new Date();
  // some intelligent update mechanism should be here but
  // instead we set an update interval
  const updateInterval = 7 * 24 * 60 * 60 * 1000;
	return ( dispatch , getState ) => {
		const lastUpdated = 0; //getState().crops.updated || 0;
		if ( (now.getTime() - lastUpdated) > updateInterval ){
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
					dispatch(fetchError(res));
				}
				dispatch(loadingCrops(false));
				//return {res};
			});
		}
	};
};

export const fetchCombinations = () => {

}
