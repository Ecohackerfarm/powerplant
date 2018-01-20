import { addBed } from '.';

/**
 * creates an action object for ADD_BED
 * {
 *   name : {string},
 *   crops : [
 *     {Crop},
 *     ...
 *   ]
 * }
 * @param {String} locationId Document ID
 * @param {Object} bed Bed document
 * @return {Promise}
 */
const createBed = (locationId, bed) => {
	return (dispatch,getState) => {
		let newId = 0;
		let currBeds = getState().locations[locationId].beds;
		while (currBeds[newId] !== undefined) {
			newId++;
		}
		let bedEntry = {[newId] : bed};
		dispatch(addBed(locationId, bedEntry));
		return Promise.resolve({
			success : true
		});
	}
};

export {
	createBed
};
