const { expect } = require('chai');
const types = require('../../../client/actions');
const { title } = require('../../../client/reducers/title');
const { expectNoActionForAllBut } = require('./Helper');

describe('title reducer', () => {
	const { SET_TITLE } = types;
	const testedActions = [];
	describe('SET_TITLE', () => {
		let newTitle, oldTitle, myTitle;
		before(() => {
			const type = SET_TITLE;
			testedActions.push(type);
			myTitle = 'test title goes here';
			oldTitle = 'oldTitle';
			const action = {
				type: SET_TITLE,
				title: myTitle
			};
			newTitle = title(oldTitle, action);
		});
		it('should return the new title', () => {
			expect(newTitle).to.equal(myTitle);
			expect(newTitle).not.to.equal(oldTitle);
		});
	});
	// little bit of a sanity check
	// make sure we don't modify the store when we're not supposed to
	describe('everything else', () => {
		it('should do nothing', () => {
			const state = 'title';
			const action = {
				title: 'newTitle'
			};
			expectNoActionForAllBut(title, testedActions, state, action);
		});
	});
});
