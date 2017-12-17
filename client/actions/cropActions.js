import axios from 'axios';
import { setCrops } from '.';
import { store } from '/client/index';

/**
 * Async sends a request to get crops by prefix/name
 * @function
 * @param  {String} names regex of crop names
 * @return {Promise}    the network request
 */
export const getCrops = ({index,length,name = ''}) => {

	return (dispatch,getState) => {
			//if (getState.crops.updated.)
			//}
		axios.get(
		  '/api/get-organisms-by-name?name='
			+ name
			+ '&index='
			+ index
			+ '&length='
			+ length
		).then(res => {
			if (res.status === 200) {
				setCrops(res.data);
			}
			return res;
		});
	};
};

export const fetchCrops = ({index,length,name = ''}) => {

	return dispatch =>
		axios.get(
		  '/api/get-organisms-by-name?name='
			+ name
			+ '&index='
			+ index
			+ '&length='
			+ length
		).then(res => {
			if (res.status === 200) {
				setCrops(res.data);
			}
			return res;
		});
};

export const getCropNames = () => {
	 return (dispatch) => dispatch(getCrops({}))
}
