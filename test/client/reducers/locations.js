import { expect } from 'chai';
import * as types from '/client/actions/types';
import { locations } from '/client/reducers';
import { defaultState } from '/client/reducers/locations';
import { randString } from '/client/utils';
import { expectNoActionForAllBut as sanityCheck } from './Helper';

describe('locations reducer', () => {
	const testedActions = [];
	// Some test location data taken from the running app
	const myloc = [
		{
			name: 'Machu Picchu',
			loc: {
				address: 'Aguas Calientes, Peru',
				coordinates: [-72.5254412, -13.1547062]
			},
			_id: '6'
		}
	];
	const sampleLocationList = [
		{
			name: 'Le Moulin Rouge',
			loc: {
				address: '82 Boulevard de Clichy, 75018 Paris, France',
				coordinates: [2.3322519, 48.8841232]
			},
			_id: '0'
		},
		{
			name: 'Statue of liberty',
			loc: {
				address: 'Statue of Liberty, New York, NY 10004, USA',
				coordinates: [-74.0445004, 40.6892494]
			},
			_id: '1'
		},
		{
			name: 'Taj Mahal',
			loc: {
				address: 'Dharmapuri,  Uttar Pradesh 282001, India',
				coordinates: [78.0421552, 27.1750151]
			},
			_id: '2'
		},
		{
			name: 'The Potala Palace',
			loc: {
				address: '35 Beijing Middle Rd, China, 850000',
				coordinates: [91.1185792, 29.6554942]
			},
			_id: '3'
		}
	];
	describe('SET_LOCATIONS', () => {
		let state, newLocations, newState;
		before(() => {
			const type = types.SET_LOCATIONS;
			var test = 'hello';
			testedActions.push(type);
			state = sampleLocationList;
			newLocations = [
				{
					name: 'Kilimanjaro',
					loc: {
						address: 'Mt Kilimanjaro, Tanzania',
						coordinates: [37.3556273, -3.0674247]
					},
					_id: '0'
				},
				{
					name: 'Neuschwanstein Castle',
					loc: {
						address: 'Neuschwansteinstraße 20, 87645 Schwangau, Germany',
						coordinates: [10.7498004, 47.557574]
					},
					_id: '1'
				},
				{
					name: 'Statue of liberty',
					loc: {
						address:
							'Statue of Liberty National Monument, New York, NY 10004, USA',
						coordinates: [-74.0445004, 40.6892494]
					},
					_id: '2'
				}
			];
			const action = { type, locations: newLocations };
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
			const action = { type, location: newLocation };
			newState = locations(state, action);
		});
		it('Should add the new location to the list', () => {
			expect(newState).to.not.equal(state);
			expect(newState).to.have.length(state.length + 1);
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
			locChange = { loc: [+15.23254, +11.55668] };
			const nameChangeAction = { type, id: myloc[0]._id, nameChange };
			const locChangeAction = { type, id: myloc[0]._id, locChange };
			state = myloc;
			changedName = locations(state, nameChangeAction);
			changedLoc = locations(state, locChangeAction);
		});
		it('should modify the location name', () => {
			expect(changedName, JSON.stringify(changedName)).to.have.length(1);
			expect(changedName[0]).to.have.all.keys({
				_id: myloc[0]._id,
				name: nameChange.name,
				loc: state.loc
			});
			expect(changedName[0]).to.not.equal(myloc);
		});
		it('should modify the location coordinates', () => {
			expect(changedLoc).to.have.length(1);
			expect(changedLoc[0]).to.have.all.keys({
				_id: myloc[0]._id,
				name: state.name,
				loc: locChange.loc
			});
			expect(changedLoc[0]).not.to.equal(myloc);
		});
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
