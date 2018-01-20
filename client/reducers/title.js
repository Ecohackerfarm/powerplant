import { SET_TITLE } from '../actions';

const initialState = 'powerplant';

export function title(state = initialState, action) {
	switch (action.type) {
		case SET_TITLE:
			return action.title;
		default:
			return state;
	}
};
