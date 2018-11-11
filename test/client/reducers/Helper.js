const { assert } = require('chai');

const types = require('../../../client/actions');

const expectNoActionForAllBut = (
	reducer,
	validTypes,
	sampleState,
	sampleAction
) => {
	for (let key in types) {
		const type = types[key];
		if (validTypes.indexOf(type) < 0) {
			const action = Object.assign({}, sampleAction, { type });
			const state = Object.assign({}, sampleState);
			const newState = reducer(state, action);
			assert.equal(newState, state, 'type=' + type);
		}
	}
};

module.exports = {
	expectNoActionForAllBut
};
