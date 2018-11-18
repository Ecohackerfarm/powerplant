const { assert } = require('chai');
const pfaf = require('../../db/pfaf.js');

describe('pfaf.json', () => {
	it('is uncorrupted', () => {
		const crops = pfaf.readCrops();
		assert.equal(crops.length, 7416);
		crops.forEach(object => {
			assert.isNotNull(object);
			assert.equal(typeof object, 'object');
		});
	});
});
