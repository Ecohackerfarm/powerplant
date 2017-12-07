import { expect } from 'chai';
import * as types from '/client/actions/types';
import { currLocation } from '/client/reducers';
import { defaultState } from '/client/reducers/currLocation';
import { expectNoActionForAllBut as sanityCheck } from './Helper';

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
			expect(newState).to.equal(defaultState);
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
			sanityCheck(currLocation, testedActions, state, action);
		});
	});
});
