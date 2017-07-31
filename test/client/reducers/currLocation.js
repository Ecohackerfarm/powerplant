import { expect } from 'chai';
import * as types from '/client/actions/types';
import { currLocation } from '/client/reducers';
import { defaultState } from '/client/reducers/currLocation';
import { expectNoActionForAllBut as sanityCheck } from './Helper';

describe('currLocation reducer', () => {
	const actions = [];
	describe('SET_CURRENT_LOCATION', () => {
		const type = types.SET_CURRENT_LOCATION;
		actions.push(type);
		const location = 'right here';
		it('should set the Location', () => {
			const action = { type, location };
			const state = 'Before location';
			const newState = currLocation(state, action);
			expect(newState).to.equal(location);
			expect(newState).not.to.equal(state);
		});
	});
	describe('LOGOUT', () => {
		const type = types.LOGOUT;
		actions.push(type);
		it('should clear on LOGOUT', () => {
			const action = { type };
			const state = 'Before location';
			const newState = currLocation(state, action);
			expect(newState).to.equal(defaultState);
			expect(newState).not.to.equal(state);
		});
	});
	describe('everything else', () => {
		const location = 'a location goes here';
		it('should do nothing', () => {
			const state = 'before location';
			const action = { location };
			sanityCheck(currLocation, actions, state, action);
		});
	});
});
