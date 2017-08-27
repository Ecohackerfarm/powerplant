import { expect } from 'chai';
import * as types from '/client/actions/types';
import { locations } from '/client/reducers';
import { defaultState } from '/client/reducers/locations';
import { randString } from '/client/utils';
import { expectNoActionForAllBut as sanityCheck } from './Helper';

describe('locations reducer', () => {
	const testedActions = [];
	const myloc = [{ _id: '5', name: 'myloc', loc: [+30.30642, -120.61458]}];
	const sampleLocationList = [
		{ _id:'0' ,name: 'location 0', loc: [+30.30642, -120.61458]},
		{ _id:'1' ,name: 'location 1', loc: [+31.30642, -121.61458]},
		{ _id:'2' ,name: 'location 2', loc: [+33.30642, -123.61458]},
		{ _id:'3' ,name: 'location 3', loc: [+32.30642, -122.61458]}
	];
	describe('SET_LOCATIONS', () => {
		let state, newLocations, newState;
		before(() => {
			const type = types.SET_LOCATIONS;
			var test = "hello";
			testedActions.push(type);
			state = sampleLocationList;
			newLocations = [
				{ _id:'0' ,name: 'location 0b', loc: [+39.30642, -129.61458]},
				{ _id:'1' ,name: 'location 1' , loc: [+31.30642, -121.61458]},
				{ _id:'2' ,name: 'location 2b', loc: [+38.30642, -128.61458]}
			];
			const action = {type, locations:newLocations};
			newState = locations(state, action);
		});
		it('Should set the new locations as current locations', () => {
			expect(newState).to.not.equal(state);
			expect(newState).to.equal(newLocations);
		});
	});
	describe('ADD_LOCATION', () => {
		let state, newLocation, newState;
		before(() => {
			const type = types.ADD_LOCATION;
			testedActions.push(type);
			state = sampleLocationList;
			newLocation = myloc[0];
			const action = {type, location:newLocation};
			newState = locations(state, action);
		});
		it('Should add the new location to the list', () => {
			expect(newState).to.not.equal(state);
			expect(newState).to.have.length(state.length+1);
			expect(newState).to.include(newLocation);
		});
		it('TODO : behaviour in case of _id conflict');
	});
	describe('EDIT_LOCATION', () => {
		let state, nameChange, locChange, changedName, changedLoc;
		before(() => {
			const type = types.EDIT_LOCATION;
			testedActions.push(type);
			nameChange = { name: randString() };
			locChange  = { loc : [+15.23254, +11.55668]};
			const nameChangeAction = { type, id: myloc[0]._id, nameChange };
			const locChangeAction  = { type, id: myloc[0]._id, locChange  };
			state = myloc;
			changedName = locations(state, nameChangeAction);
			changedLoc  = locations(state, locChangeAction );
		});
		it('should modify the location name', () => {
			expect(changedName, JSON.stringify(changedName)).to.have.length(1);
			expect(changedName[0]).to.have.all.keys({ _id: myloc[0]._id, name: nameChange.name, loc:state.loc});
			expect(changedName[0]).to.not.equal(myloc);
		});
		it('should modify the location coordinates', () => {
			expect(changedLoc).to.have.length(1);
			expect(changedLoc[0]).to.have.all.keys({ _id: myloc[0]._id, name: state.name, loc:locChange.loc});
			expect(changedLoc[0]).not.to.equal(myloc);
		});
		it('TODO : behaviour if location id can not be found');
	});
	describe('DELETE_LOCATION', () => {
		let newState;
		before(() => {
			const type = types.DELETE_LOCATION;
			testedActions.push(type);
			const action = { type, id: myloc[0]._id };
			newState = locations(myloc, action);
		});
		it('should clear the location when it exists', () => {
			expect(newState).to.have.length(0);
			expect(newState).not.to.equal(myloc);
		});
		it('TODO : behaviour if location id can not be found');
	});
	describe('LOGOUT', () => {
		let newState;
		before(() => {
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
				id: myloc[0]._id,
				changes: { name: randString() }
			};
			sanityCheck(locations, testedActions, myloc, action);
		});
	});
});
