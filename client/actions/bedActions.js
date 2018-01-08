import {
	EDIT_BED,
	ADD_BED,
	DELETE_BED,
} from '/client/actions/types';


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

const editBed = (locationId, bedId, changes) => ({
 type : EDIT_BED,
 locationId,
 bedId,
 changes
});

const deleteBed = (locationId, bedId) => ({
	type: DELETE_BED,
	locationId,
	bedId
});

export { createBed, deleteBed, editBed };
