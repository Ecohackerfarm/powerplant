const { assert } = require('chai');
const utils = require('../../shared/utils.js');

describe('toCamelCase', () => {
  it('with spaces', () => {
    assert.equal(utils.toCamelCase('abcd Abcd  AbCd   ABCD'), 'abcdAbcdAbcdAbcd');
  });
  it('without spaces', () => {
    assert.equal(utils.toCamelCase('abcd'), 'abcd');
  });
});
