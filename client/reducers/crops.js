import { GET_CROPS } from '../actions/types';

export const defaultState = [];

export const getCrops = (state = defaultState, action) => {
	switch (action.type) {
		case GET_CROPS:
			return action.crops;
		default:
			return state;
	}
};

export const setCrops = (state = defaultState, action) => {
	switch (action.type) {
		case GET_CROPS:
			return Object.assign({}, state,
				{
					crops: action.data
				}
			);
		default:
			return state;
	}
};
