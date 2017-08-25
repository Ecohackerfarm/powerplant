import { expect } from 'chai';
import * as types from '/client/actions/types';
import { locations } from '/client/reducers';
import { defaultState } from '/client/reducers/locations';
import { randString } from '/client/utils';
import { expectNoActionForAllBut as sanityCheck } from './Helper';

describe('locations reducer', () => {
	const testedActions = [];
	const id = '0';
	const myloc = [{ _id: id, name: 'myloc' }];
	describe('SET_LOCATIONS', () => {
		before(()=>{
			const type = types.SET_LOCATIONS;
			testedActions.push(type);
		});
		it('TODO');
	});
	describe('ADD_LOCATION', () => {
		before(()=>{
			const type = types.ADD_LOCATION;
			testedActions.push(type);
		});
		it('TODO');
	});
	describe('EDIT_LOCATION', () => {
		let changes, newState;
		before(()=>{
			const type = types.EDIT_LOCATION;
			testedActions.push(type);
			changes = { name: randString() };
			const action = { type, id, changes };
			newState = locations(myloc, action);
		});
		it('should modify the location properties', () => {
			expect(newState).to.have.length(1);
			expect(newState[0]).to.have.all.keys({ _id: id, name: changes.name });
			expect(newState[0]).not.to.equal(myloc);
		});
	});
	describe('DELETE_LOCATION', () => {
		let newState;
		before(()=>{
			const type = types.DELETE_LOCATION;
			testedActions.push(type);
			const action = { type, id };
			newState = locations(myloc, action);
		});
		it('should clear the location when it exists', () => {
			expect(newState).to.have.length(0);
			expect(newState).not.to.equal(myloc);
		});
	});
	describe('LOGOUT', () => {
		let newState;
		before(()=>{
			const type = types.LOGOUT;
			testedActions.push(type);
			const action = { type };
			newState = locations(myloc, action);
		});
		it('should clear all data', () => {
			expect(newState).to.equal(defaultState);
			expect(newState).not.to.equal(myloc);
		});
	});
	describe('everything else', () => {
		it('should do nothing', () => {
			const action = {
				id: id,
				changes: { name: randString() }
			};
			sanityCheck(locations, testedActions, myloc, action);
		});
	});
});
