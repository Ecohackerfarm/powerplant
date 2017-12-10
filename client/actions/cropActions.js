import axios from 'axios';
import { getOrganismsByName } from '.';
import { store } from '/client/index';

/**
 * Async sends a request to get crops by prefix/name
 * On response, dispatches a {@link client.actions.setLocationsAction setLocationsAction}
 * Does nothing if not authenticated
 * @function
 * @param  {String} names names of user whose locations are being fetched
 * @return {Promise}    the network request
 */
export const getCropsByName = ({name,index,length}) => {
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
				dispatch(getOrganismsByName(res.data));
			}
			return res;
		});
};
