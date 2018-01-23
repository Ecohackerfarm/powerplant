import {
	EDIT_BED,
	ADD_BED,
	DELETE_BED,
} from './types';


/**
 * creates an action object for ADD_BED
 * {
 *   name : {string},
 *   crops : [
 *     {Crop},
 *     ...
 *   ]
 * }
 * @param  {string} locationId identifier of the location
 * @param  {object} bed        object in form of bed
 * @return {Promise}
 */
const createBed = (locationId, bed) => {
	return (dispatch,getState) => {
		let newId = 0;
		let currBeds = getState().locations[locationId].beds;
		while(currBeds[newId] !== undefined){
						newId++;
		}
		let bedEntry = {[newId] : bed}
		dispatch({
			type: ADD_BED,
			locationId,
			bedEntry
		})
		return Promise.resolve({
			success : true
		});
	}

};

/**
 * creates an EDIT_BED action object
 * @param  {string} locationId id of the location where the bed is located
 * @param  {string} bedId      id of the bed in the location
 * @param  {object} changes    object of changes in the bed object
 * @return {object}            action object
 */
const editBed = (locationId, bedId, changes) => ({
 type : EDIT_BED,
 locationId,
 bedId,
 changes
});

/**
 * creates a DELETE_BED action object
 * @param  {string} locationId id of the location where the bed is located
 * @param  {string} bedId      id of the bed in the location
 * @return {object}            action object
 */
const deleteBed = (locationId, bedId) => ({
	type: DELETE_BED,
	locationId,
	bedId
});

export { createBed, deleteBed, editBed };
