const { assert } = require('chai');
const practicalplants = require('../../db/practicalplants.js');

describe('practicalplants.json', () => {
	function updateMissingCountsAndCheckValues(missingCounts, object, property, allowedValues) {
		const functionsProperty = (property == 'functions') && (allowedValues === practicalplants.ALL_FUNCTIONS_VALUES);
		if ((!(property in object)) || (functionsProperty && (object[property]['function'] === undefined))) {
			if (!(property in missingCounts)) {
				missingCounts[property] = 0;
			}
			missingCounts[property]++;
		} else {
			if (practicalplants.ARRAY_PROPERTIES.includes(property)) {
				const array = functionsProperty ? object[property]['function'] : object[property];
				assert.isTrue(practicalplants.getAsArray(array).every(value => allowedValues.includes(value)), JSON.stringify(array));
			} else if (practicalplants.NUMBER_PROPERTIES.includes(property)) {
				const value = parseFloat(object[property]);
				assert.isTrue(value >= 0);
				assert.isTrue(value <= allowedValues);
			} else {
				const value = object[property];
				assert.isTrue(allowedValues.includes(value), value);
			}
		}
	}
	
	function assertArrayPropertyOfRangeHasAllValuesInBetween(arrayValue, allValues) {
		const indices = arrayValue.map(value => allValues.findIndex(temp => (temp == value)));
		indices.sort((a, b) => (a - b));
		return indices.every((value, index) => ((index == indices.length) || ((value + 1) == indices[index + 1])));
	}
	
	it('raw practicalplants.org data contains only analyzed properties and values', () => {
		const crops = practicalplants.readCropsLower();
		let missingCounts = {};
		
		assert.equal(crops.length, 7416);
		
		crops.forEach(object => {
			assert.isNotNull(object);
			assert.equal(typeof object, 'object');
			
			Object.keys(object).forEach(property => assert.isTrue(practicalplants.ALL_PROPERTIES.includes(property), 'Unknown property "' + property + '"'));
			
			updateMissingCountsAndCheckValues(missingCounts, object, 'hardiness zone', practicalplants.ALL_HARDINESS_ZONE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil texture', practicalplants.ALL_SOIL_TEXTURE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil ph', practicalplants.ALL_SOIL_PH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil water retention', practicalplants.ALL_SOIL_WATER_RETENTION_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'shade', practicalplants.ALL_SHADE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'sun', practicalplants.ALL_SUN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'water', practicalplants.ALL_WATER_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'drought', practicalplants.ALL_DROUGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'poornutrition', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'ecosystem niche', practicalplants.ALL_ECOSYSTEM_NICHE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'life cycle', practicalplants.ALL_LIFE_CYCLE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'herbaceous or woody', practicalplants.ALL_HERBACEOUS_OR_WOODY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'deciduous or evergreen', practicalplants.ALL_DECIDUOUS_OR_EVERGREEN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'growth rate', practicalplants.ALL_GROWTH_RATE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature measurement unit', practicalplants.ALL_MATURE_MEASUREMENT_UNIT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature height', practicalplants.ALL_MATURE_HEIGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature width', practicalplants.ALL_MATURE_WIDTH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'flower type', practicalplants.ALL_FLOWER_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollinators', practicalplants.ALL_POLLINATORS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'wind', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'maritime', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollution', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'functions', practicalplants.ALL_FUNCTIONS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'grow from', practicalplants.ALL_GROW_FROM_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'cutting type', practicalplants.ALL_CUTTING_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'fertility', practicalplants.ALL_FERTILITY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'root zone', practicalplants.ALL_ROOT_ZONE_VALUES);
		});
		
		assert.equal(missingCounts['hardiness zone'], 2534);
		assert.equal(missingCounts['soil texture'], 3);
		assert.equal(missingCounts['soil ph'], 2);
		assert.equal(missingCounts['soil water retention'], 2997);
		assert.equal(missingCounts['shade'], 2);
		assert.equal(missingCounts['sun'], 280);
		assert.equal(missingCounts['water'], 1);
		assert.equal(missingCounts['drought'], 2);
		assert.equal(missingCounts['poornutrition'], 6);
		assert.equal(missingCounts['ecosystem niche'], 5699);
		assert.equal(missingCounts['life cycle'], 752);
		assert.equal(missingCounts['herbaceous or woody'], 4306);
		assert.equal(missingCounts['deciduous or evergreen'], 3924);
		assert.equal(missingCounts['growth rate'], 6177);
		assert.equal(missingCounts['mature measurement unit'], 141);
		assert.equal(missingCounts['mature height'], 1005);
		assert.equal(missingCounts['mature width'], 4898);
		assert.equal(missingCounts['flower type'], 127);
		assert.equal(missingCounts['pollinators'], 1878);
		assert.equal(missingCounts['wind'], 6237);
		assert.equal(missingCounts['maritime'], 6767);
		assert.equal(missingCounts['pollution'], 7257);
		assert.equal(missingCounts['functions'], 6964);
		assert.equal(missingCounts['grow from'], 7354);
		assert.equal(missingCounts['cutting type'], 7385);
		assert.equal(missingCounts['fertility'], 5337);
		assert.equal(missingCounts['root zone'], 7405);
	}).timeout(0);

	it('normalized data passes integrity checks', () => {
		const crops = practicalplants.readCrops();
		let missingCounts = {};
		
		assert.equal(crops.length, 7416);
		
		crops.forEach(object => {
			assert.isNotNull(object);
			assert.equal(typeof object, 'object');
			
			Object.keys(object).forEach(property => assert.isTrue(practicalplants.PP_PROPERTIES.includes(property), 'Unknown property "' + property + '"'));
			
			updateMissingCountsAndCheckValues(missingCounts, object, 'hardiness zone', practicalplants.PP_HARDINESS_ZONE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil texture', practicalplants.PP_SOIL_TEXTURE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil ph', practicalplants.PP_SOIL_PH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil water retention', practicalplants.PP_SOIL_WATER_RETENTION_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'shade', practicalplants.PP_SHADE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'sun', practicalplants.PP_SUN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'water', practicalplants.PP_WATER_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'drought', practicalplants.PP_DROUGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'poornutrition', practicalplants.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'wind', practicalplants.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'maritime', practicalplants.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollution', practicalplants.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'ecosystem niche', practicalplants.PP_ECOSYSTEM_NICHE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'life cycle', practicalplants.PP_LIFE_CYCLE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'herbaceous or woody', practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'deciduous or evergreen', practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'growth rate', practicalplants.PP_GROWTH_RATE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature measurement unit', practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature height', practicalplants.PP_MATURE_HEIGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature width', practicalplants.PP_MATURE_WIDTH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'flower type', practicalplants.PP_FLOWER_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollinators', practicalplants.PP_POLLINATORS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'functions', practicalplants.PP_FUNCTIONS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'grow from', practicalplants.PP_GROW_FROM_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'cutting type', practicalplants.PP_CUTTING_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'fertility', practicalplants.PP_FERTILITY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'root zone', practicalplants.PP_ROOT_ZONE_VALUES);
			
			{
				/*
				 * Assert that some properties that describe a range of values (for
				 * example soil ph, from acid to alkaline) also contain all of the
				 * values in between. This quality is used by the companionship
				 * algorithm.
				 */
				assertArrayPropertyOfRangeHasAllValuesInBetween(object['soil ph'], practicalplants.ALL_SOIL_PH_VALUES);
				assertArrayPropertyOfRangeHasAllValuesInBetween(object['soil texture'], practicalplants.ALL_SOIL_TEXTURE_VALUES);
				assertArrayPropertyOfRangeHasAllValuesInBetween(object['soil water retention'], practicalplants.ALL_SOIL_WATER_RETENTION_VALUES);
			}
		});
		
		assert.isTrue(Object.keys(missingCounts).length == 0);
	}).timeout(0);
});
