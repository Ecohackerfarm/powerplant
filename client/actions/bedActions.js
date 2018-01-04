import {
	EDIT_BED,
	ADD_BED,
	DELETE_BED,
	LOGOUT,
} from '/client/actions/types';

/**
 * @namespace bedActions
 * @memberof client.actions
 */
const type = 'DO_NOTHING';

const createBed = (locationId, bed) => {
	return (dispatch,getState) => {
		let newId = 0;
		let currBeds = getState().locations[locationId].beds;
		while(currBeds[newId] !== undefined){
						newId++;
		}
		let bedEntry = {[newId] : bed}
		return ({
			type: ADD_BED,
			locationId,
			bedEntry
		})
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
