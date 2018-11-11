const { assert, expect } = require('chai');
const types = require('../../../client/actions');
const { locations } = require('../../../client/reducers/locations');
const { initialState } = require('../../../client/reducers/locations');
const { randString } = require('../../../client/utils');
const { expectNoActionForAllBut } = require('./Helper');

describe('locations reducer', () => {
	const testedActions = [];
	// Some test location data taken from the running app
	const mylocKey = '6';
	const myloc = {
		'6': {
			name: 'Machu Picchu',
			loc: {
				address: 'Aguas Calientes, Peru',
				coordinates: [-72.5254412, -13.1547062]
			},
		}
	};
	const sampleLocationList = {
		'0': {
			name: 'Le Moulin Rouge',
			loc: {
				address: '82 Boulevard de Clichy, 75018 Paris, France',
				coordinates: [2.3322519, 48.8841232]
			},
		},
		'1': {
			name: 'Statue of liberty',
			loc: {
				address: 'Statue of Liberty, New York, NY 10004, USA',
				coordinates: [-74.0445004, 40.6892494]
			},
		},
		'2': {
			name: 'Taj Mahal',
			loc: {
				address: 'Dharmapuri,  Uttar Pradesh 282001, India',
				coordinates: [78.0421552, 27.1750151]
			},
		},
		'3': {
			name: 'The Potala Palace',
			loc: {
				address: '35 Beijing Middle Rd, China, 850000',
				coordinates: [91.1185792, 29.6554942]
			},
		}
	};
	describe('SET_LOCATIONS', () => {
		let state, newLocations, newState;
		before(() => {
			const type = types.SET_LOCATIONS;
			var test = 'hello';
			testedActions.push(type);
			state = sampleLocationList;
			newLocations = {
				'0': {
					name: 'Kilimanjaro',
					loc: {
						address: 'Mt Kilimanjaro, Tanzania',
						coordinates: [37.3556273, -3.0674247]
					},
				},
				'1': {
					name: 'Neuschwanstein Castle',
					loc: {
						address: 'Neuschwansteinstraße 20, 87645 Schwangau, Germany',
						coordinates: [10.7498004, 47.557574]
					},
				},
				'2': {
					name: 'Statue of liberty',
					loc: {
						address:
							'Statue of Liberty National Monument, New York, NY 10004, USA',
						coordinates: [-74.0445004, 40.6892494]
					},
				}
			};
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
			newLocation = myloc;
			const action = { type, locationEntry: newLocation };
			newState = locations(state, action);
		});
		it('Should add the new location to the list', () => {
			expect(newState).to.not.equal(state);
			assert.equal(Object.keys(newState).length, Object.keys(state).length + 1);
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
			const nameChangeAction = { type, id: mylocKey, nameChange };
			const locChangeAction = { type, id: mylocKey, locChange };
			state = myloc;
			changedName = locations(state, nameChangeAction);
			changedLoc = locations(state, locChangeAction);
		});
		it('should modify the location name', () => {
			console.log(changedName);
			assert.equal(Object.keys(changedName).length, 1);
			expect(changedName[mylocKey]).to.have.all.keys({
				name: nameChange.name,
				loc: state.loc
			});
			expect(changedName).to.not.equal(myloc);
		});
		it('should modify the location coordinates', () => {
			assert.equal(Object.keys(changedLoc).length, 1);
			expect(changedLoc[mylocKey]).to.have.all.keys({
				name: state.name,
				loc: locChange.loc
			});
			expect(changedLoc).not.to.equal(myloc);
		});
	});
	describe('DELETE_LOCATION', () => {
		let newState;
		before(() => {
			const type = types.DELETE_LOCATION;
			testedActions.push(type);
			const action = { type, id: mylocKey };
			newState = locations(myloc, action);
		});
		it('should clear the location when it exists', () => {
			assert.equal(Object.keys(newState).length, 0);
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
			expect(newState).to.equal(initialState);
			expect(newState).not.to.equal(myloc);
		});
	});
	describe('Bed actions', () => {
		it('TODO');
	});
	describe('everything else', () => {
		it('should do nothing', () => {
			const action = {
				id: mylocKey,
				changes: { name: randString() }
			};
			testedActions.push(types.ADD_BED);
			testedActions.push(types.EDIT_BED);
			testedActions.push(types.DELETE_BED);
			expectNoActionForAllBut(locations, testedActions, myloc, action);
		});
	});
});
