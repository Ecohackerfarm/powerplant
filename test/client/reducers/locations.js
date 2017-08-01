import { expect } from 'chai';
import * as types from '/client/actions/types';
import { locations } from '/client/reducers';
import { defaultState } from '/client/reducers/locations';
import { randString } from '/client/utils';
import { expectNoActionForAllBut as sanityCheck } from './Helper';

describe('locations reducer', () => {
	const actions = [];
	describe('SET_LOCATIONS', () => {
		const type = types.SET_LOCATIONS;
		actions.push(type);
	});
	describe('ADD_LOCATION', () => {
		const type = types.ADD_LOCATION;
		actions.push(type);
	});
	describe('EDIT_LOCATION', () => {
		const type = types.EDIT_LOCATION;
		actions.push(type);
		it('should modify the location properties', () => {
			const state = [{ _id: '0', name: 'myloc' }];
			const id = '0';
			const changes = { name: randString() };
			const action = { type, id, changes };
			const newState = locations(state, action);
			expect(newState).to.have.length(1);
			expect(newState[0]).to.have.all.keys({ _id: '0', name: changes.name });
			expect(newState[0]).not.to.equal(state);
		});
	});
	describe('DELETE_LOCATION', () => {
		const type = types.DELETE_LOCATION;
		actions.push(type);
		it('should clear the location when it exists', () => {
			const state = [{ _id: '0', name: 'myloc' }];
			const id = '0';
			const action = { type, id };
			const newState = locations(state, action);
			expect(newState).to.have.length(0);
			expect(newState).not.to.equal(state);
		});
	});
	describe('LOGOUT', () => {
		const type = types.LOGOUT;
		actions.push(type);
		it('should clear all data', () => {
			const state = [{ _id: '0', name: 'myLoc' }];
			const action = { type };
			const newState = locations(state, action);
			expect(newState).to.equal(defaultState);
			expect(newState).not.to.equal(state);
		});
	});
	describe('everything else', () => {
		it('should do nothing', () => {
			const state = [{ _id: '0', name: 'myloc' }];
			const action = {
				id: '0',
				changes: { name: randString() }
			};
			sanityCheck(locations, actions, state, action);
		});
	});
});
