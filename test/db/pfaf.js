const { assert } = require('chai');
const pfaf = require('../../db/pfaf.js');

describe('pfaf.json', () => {
	function updateMissingCountsAndCheckValues(missingCounts, object, property, allowedValues) {
		const functionsProperty = (property == 'functions') && (allowedValues === pfaf.ALL_FUNCTIONS_VALUES);
		if ((!(property in object)) || (functionsProperty && (object[property]['function'] === undefined))) {
			if (!(property in missingCounts)) {
				missingCounts[property] = 0;
			}
			missingCounts[property]++;
		} else {
			if (pfaf.ARRAY_PROPERTIES.includes(property)) {
				const array = functionsProperty ? object[property]['function'] : object[property];
				assert.isTrue(pfaf.getAsArray(array).every(value => allowedValues.includes(value)), JSON.stringify(array));
			} else if (pfaf.NUMBER_PROPERTIES.includes(property)) {
				const value = parseFloat(object[property]);
				assert.isTrue(value >= 0);
				assert.isTrue(value <= allowedValues);
			} else {
				const value = object[property];
				assert.isTrue(allowedValues.includes(value), value);
			}
		}
	}
	
	it('raw practicalplants.org data contains only analyzed properties and values', () => {
		const crops = pfaf.readCropsLower();
		let missingCounts = {};
		
		assert.equal(crops.length, 7416);
		
		crops.forEach(object => {
			assert.isNotNull(object);
			assert.equal(typeof object, 'object');
			
			Object.keys(object).forEach(property => assert.isTrue(pfaf.ALL_PROPERTIES.includes(property), 'Unknown property "' + property + '"'));
			
			updateMissingCountsAndCheckValues(missingCounts, object, 'hardiness zone', pfaf.ALL_HARDINESS_ZONE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil texture', pfaf.ALL_SOIL_TEXTURE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil ph', pfaf.ALL_SOIL_PH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil water retention', pfaf.ALL_SOIL_WATER_RETENTION_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'shade', pfaf.ALL_SHADE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'sun', pfaf.ALL_SUN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'water', pfaf.ALL_WATER_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'drought', pfaf.ALL_DROUGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'poornutrition', pfaf.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'ecosystem niche', pfaf.ALL_ECOSYSTEM_NICHE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'life cycle', pfaf.ALL_LIFE_CYCLE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'herbaceous or woody', pfaf.ALL_HERBACEOUS_OR_WOODY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'deciduous or evergreen', pfaf.ALL_DECIDUOUS_OR_EVERGREEN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'growth rate', pfaf.ALL_GROWTH_RATE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature measurement unit', pfaf.ALL_MATURE_MEASUREMENT_UNIT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature height', pfaf.ALL_MATURE_HEIGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature width', pfaf.ALL_MATURE_WIDTH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'flower type', pfaf.ALL_FLOWER_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollinators', pfaf.ALL_POLLINATORS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'wind', pfaf.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'maritime', pfaf.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollution', pfaf.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'functions', pfaf.ALL_FUNCTIONS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'grow from', pfaf.ALL_GROW_FROM_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'cutting type', pfaf.ALL_CUTTING_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'fertility', pfaf.ALL_FERTILITY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'root zone', pfaf.ALL_ROOT_ZONE_VALUES);
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
		const crops = pfaf.readCrops();
		let missingCounts = {};
		
		assert.equal(crops.length, 7416);
		
		crops.forEach(object => {
			assert.isNotNull(object);
			assert.equal(typeof object, 'object');
			
			Object.keys(object).forEach(property => assert.isTrue(pfaf.PP_PROPERTIES.includes(property), 'Unknown property "' + property + '"'));
			
			updateMissingCountsAndCheckValues(missingCounts, object, 'hardiness zone', pfaf.PP_HARDINESS_ZONE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil texture', pfaf.PP_SOIL_TEXTURE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil ph', pfaf.PP_SOIL_PH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soil water retention', pfaf.PP_SOIL_WATER_RETENTION_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'shade', pfaf.PP_SHADE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'sun', pfaf.PP_SUN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'water', pfaf.PP_WATER_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'drought', pfaf.PP_DROUGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'poornutrition', pfaf.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'wind', pfaf.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'maritime', pfaf.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollution', pfaf.PP_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'ecosystem niche', pfaf.PP_ECOSYSTEM_NICHE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'life cycle', pfaf.PP_LIFE_CYCLE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'herbaceous or woody', pfaf.PP_HERBACEOUS_OR_WOODY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'deciduous or evergreen', pfaf.PP_DECIDUOUS_OR_EVERGREEN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'growth rate', pfaf.PP_GROWTH_RATE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature measurement unit', pfaf.PP_MATURE_MEASUREMENT_UNIT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature height', pfaf.PP_MATURE_HEIGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'mature width', pfaf.PP_MATURE_WIDTH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'flower type', pfaf.PP_FLOWER_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollinators', pfaf.PP_POLLINATORS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'functions', pfaf.PP_FUNCTIONS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'grow from', pfaf.PP_GROW_FROM_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'cutting type', pfaf.PP_CUTTING_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'fertility', pfaf.PP_FERTILITY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'root zone', pfaf.PP_ROOT_ZONE_VALUES);
		});
		
		assert.isTrue(Object.keys(missingCounts).length == 0);
	}).timeout(0);
});
