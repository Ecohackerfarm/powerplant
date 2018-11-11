const { expect } = require('chai');
const types = require('../../../client/actions');
const { currLocation } = require('../../../client/reducers/currLocation');
const { initialState } = require('../../../client/reducers/currLocation');
const { expectNoActionForAllBut } = require('./Helper');

describe('currLocation reducer', () => {
	const testedActions = [];
	describe('SET_CURRENT_LOCATION', () => {
		let location, state, newState;
		before(() => {
			const type = types.SET_CURRENT_LOCATION;
			testedActions.push(type);
			location = 'right here';
			const action = { type, location };
			state = 'Before location';
			newState = currLocation(state, action);
		});
		it('should set the Location', () => {
			expect(newState).to.equal(location);
			expect(newState).not.to.equal(state);
		});
	});
	describe('LOGOUT', () => {
		let state, newState;
		before(() => {
			const type = types.LOGOUT;
			testedActions.push(type);
			const action = { type };
			state = 'Before location';
			newState = currLocation(state, action);
		});
		it('should clear on LOGOUT', () => {
			expect(newState).to.equal(initialState);
			expect(newState).not.to.equal(state);
		});
	});
	describe('everything else', () => {
		let location, state, action;
		before(() => {
			location = 'a location goes here';
			state = 'before location';
			action = { location };
		});
		it('should do nothing', () => {
			expectNoActionForAllBut(currLocation, testedActions, state, action);
		});
	});
});
