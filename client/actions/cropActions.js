import axios from 'axios';
import { getCropsByName } from '.';
import { store } from '/client/index';

/**
 * Async sends a request to get crops by prefix/name
 * On response, dispatches a {@link client.actions.getCropsByNameAction setCropsByNameAction}
 * @function
 * @param {String} name
 * @param {Number} index
 * @param {Number} length
 * @return {Promise} the network request
 */
export const getCropsByNameRequest = ({name, index, length}) => {
	return dispatch =>
		axios.get(
		  '/api/get-crops-by-name?name='
			+ name
			+ '&index='
			+ index
			+ '&length='
			+ length
		).then(res => {
			if (res.status === 200) {
				dispatch(getCropsByName(res.data));
			}
			return res;
		});
};
