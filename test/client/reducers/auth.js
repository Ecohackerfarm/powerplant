const { expect } = require('chai');
const types = require('../../../client/actions');
const { auth } = require('../../../client/reducers/auth');
const { expectNoActionForAllBut } = require('./Helper');

describe('auth reducer', () => {
	const testedActions = [];
	describe('SET_CURRENT_USER', () => {
		let user, state, newState;
		before(() => {
			const type = types.SET_CURRENT_USER;
			testedActions.push(type);
			user = 'user';
			const action = { type, user };
			state = { isAuthenticated: false };
			newState = auth(state, action);
		});
		it('should set authenticated to true', () => {
			expect(newState).to.have.property('isAuthenticated').and.be.true;
			expect(newState).not.to.equal(state);
		});
		it('should set currentUser', () => {
			expect(newState)
				.to.have.property('currentUser')
				.and.to.equal(user);
			expect(newState).not.to.equal(state);
		});
	});
	describe('CREATE_USER', () => {
		before(() => {
			const type = types.SET_CURRENT_USER;
			testedActions.push(type);
		});
		it('TODO, not sure what this will do yet');
	});
	describe('LOGOUT', () => {
		let state, newState;
		before(() => {
			const type = types.LOGOUT;
			testedActions.push(type);
			const action = { type };
			state = {
				isAuthenticated: true,
				currentUser: 'user'
			};
			newState = auth(state, action);
		});
		it('should set isAuthenticated to false', () => {
			expect(newState).to.have.property('isAuthenticated').and.be.false;
			expect(newState).not.to.equal(state);
		});
		it('should remove currentUser', () => {
			expect(newState).not.to.have.property('currentUser');
			expect(newState).not.to.equal(state);
		});
	});
	describe('everything else', () => {
		let state, action;
		before(() => {
			state = {
				isAuthenticated: true,
				currentUser: 'user'
			};
			action = {};
		});
		it('should do nothing', () => {
			expectNoActionForAllBut(auth, testedActions, state, action);
		});
	});
});
