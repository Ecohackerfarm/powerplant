const { assert } = require('chai');
const practicalplants = require('../../db/practicalplants.js');

describe('practicalplants.json', () => {
	function updateMissingCountsAndCheckValues(missingCounts, object, property, allowedValues) {
		if (updateMissingCount(missingCounts, object, property, allowedValues)) {
			assertValue(object, property, allowedValues);
		}
	}
	
	function updateMissingCount(missingCounts, object, property, allowedValues) {
		if ((!(property in object)) || (isFunctionsPropertyOfUnnormalizedObject(property, allowedValues) && (object[property]['function'] === undefined))) {
			if (!(property in missingCounts)) {
				missingCounts[property] = 0;
			}
			missingCounts[property]++;
			return false;
		}
		return true;
	}
	
	function assertValueOrMissing(object, property, allowedValues) {
		const value = object[property];
		if (!((value === null) || (Array.isArray(value) && (value.length === 0)))) {
			assertValue(object, property, allowedValues);
		}
	}
	
	function assertValue(object, property, allowedValues) {
		if (practicalplants.ARRAY_PROPERTIES.includes(property)) {
			const array = isFunctionsPropertyOfUnnormalizedObject(property, allowedValues) ? object[property]['function'] : object[property];
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
	
	function isFunctionsPropertyOfUnnormalizedObject(property, allowedValues) {
		return (property == 'functions') && (allowedValues === practicalplants.ALL_FUNCTIONS_VALUES);
	}
	
	function assertArrayPropertyOfRangeHasAllValuesInBetween(arrayValue, allValues) {
		const indices = arrayValue.map(value => allValues.findIndex(temp => (temp == value)));
		indices.sort((a, b) => (a - b));
		return indices.every((value, index) => ((index == indices.length) || ((value + 1) == indices[index + 1])));
	}
	
	function assertNoDuplicates(values) {
		assert.isTrue(values.every(value => (values.indexOf(value) == values.lastIndexOf(value))));
	}
	
	it('raw practicalplants.org data contains only analyzed properties and values', () => {
		const crops = practicalplants.readCropsLower();
		let missingCounts = {};
		
		assert.equal(crops.length, 7416);
		
		crops.forEach(object => {
			assert.isNotNull(object);
			assert.equal(typeof object, 'object');
			
			Object.keys(object).forEach(property => assert.isTrue(practicalplants.ALL_PROPERTIES.includes(property) || practicalplants.PP_PROPERTIES.includes(property), 'Unknown property "' + property + '"'));
			
			updateMissingCount(missingCounts, object, 'commonName');
			updateMissingCount(missingCounts, object, 'binomialName');
			updateMissingCountsAndCheckValues(missingCounts, object, 'hardinessZone', practicalplants.ALL_HARDINESS_ZONE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soilTexture', practicalplants.ALL_SOIL_TEXTURE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soilPh', practicalplants.ALL_SOIL_PH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'soilWaterRetention', practicalplants.ALL_SOIL_WATER_RETENTION_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'shade', practicalplants.ALL_SHADE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'sun', practicalplants.ALL_SUN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'water', practicalplants.ALL_WATER_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'drought', practicalplants.ALL_DROUGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'poorNutrition', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'ecosystemNiche', practicalplants.ALL_ECOSYSTEM_NICHE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'lifeCycle', practicalplants.ALL_LIFE_CYCLE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'herbaceousOrWoody', practicalplants.ALL_HERBACEOUS_OR_WOODY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'deciduousOrEvergreen', practicalplants.ALL_DECIDUOUS_OR_EVERGREEN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'growthRate', practicalplants.ALL_GROWTH_RATE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'matureMeasurementUnit', practicalplants.ALL_MATURE_MEASUREMENT_UNIT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'matureHeight', practicalplants.ALL_MATURE_HEIGHT_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'matureWidth', practicalplants.ALL_MATURE_WIDTH_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'flowerType', practicalplants.ALL_FLOWER_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollinators', practicalplants.ALL_POLLINATORS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'wind', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'maritime', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'pollution', practicalplants.ALL_BOOLEAN_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'functions', practicalplants.ALL_FUNCTIONS_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'growFrom', practicalplants.ALL_GROW_FROM_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'cuttingType', practicalplants.ALL_CUTTING_TYPE_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'fertility', practicalplants.ALL_FERTILITY_VALUES);
			updateMissingCountsAndCheckValues(missingCounts, object, 'rootZone', practicalplants.ALL_ROOT_ZONE_VALUES);
		});
		
		assert.equal(missingCounts['commonName'], 2884);
		assert.equal(missingCounts['binomialName'], undefined);
		assert.equal(missingCounts['hardinessZone'], 2534);
		assert.equal(missingCounts['soilTexture'], 3);
		assert.equal(missingCounts['soilPh'], 2);
		assert.equal(missingCounts['soilWaterRetention'], 2997);
		assert.equal(missingCounts['shade'], 2);
		assert.equal(missingCounts['sun'], 280);
		assert.equal(missingCounts['water'], 1);
		assert.equal(missingCounts['drought'], 2);
		assert.equal(missingCounts['poorNutrition'], 6);
		assert.equal(missingCounts['ecosystemNiche'], 5699);
		assert.equal(missingCounts['lifeCycle'], 752);
		assert.equal(missingCounts['herbaceousOrWoody'], 4306);
		assert.equal(missingCounts['deciduousOrEvergreen'], 3924);
		assert.equal(missingCounts['growthRate'], 6177);
		assert.equal(missingCounts['matureMeasurementUnit'], 141);
		assert.equal(missingCounts['matureHeight'], 1005);
		assert.equal(missingCounts['matureWidth'], 4898);
		assert.equal(missingCounts['flowerType'], 127);
		assert.equal(missingCounts['pollinators'], 1878);
		assert.equal(missingCounts['wind'], 6237);
		assert.equal(missingCounts['maritime'], 6767);
		assert.equal(missingCounts['pollution'], 7257);
		assert.equal(missingCounts['functions'], 6964);
		assert.equal(missingCounts['growFrom'], 7354);
		assert.equal(missingCounts['cuttingType'], 7385);
		assert.equal(missingCounts['fertility'], 5337);
		assert.equal(missingCounts['rootZone'], 7405);
	}).timeout(0);

	it('normalized data passes integrity checks', () => {
		const crops = practicalplants.readCrops();
		
		assert.equal(crops.length, 7416);
		
		crops.forEach(object => {
			assert.isNotNull(object);
			assert.equal(typeof object, 'object');
			
			Object.keys(object).forEach(property => assert.isTrue(practicalplants.PP_PROPERTIES.includes(property), 'Unknown property "' + property + '"'));
			
			assertValueOrMissing(object, 'hardinessZone', practicalplants.PP_HARDINESS_ZONE_VALUES);
			assertValueOrMissing(object, 'soilTexture', practicalplants.PP_SOIL_TEXTURE_VALUES);
			assertValueOrMissing(object, 'soilPh', practicalplants.PP_SOIL_PH_VALUES);
			assertValueOrMissing(object, 'soilWaterRetention', practicalplants.PP_SOIL_WATER_RETENTION_VALUES);
			assertValueOrMissing(object, 'shade', practicalplants.PP_SHADE_VALUES);
			assertValueOrMissing(object, 'sun', practicalplants.PP_SUN_VALUES);
			assertValueOrMissing(object, 'water', practicalplants.PP_WATER_VALUES);
			assertValueOrMissing(object, 'drought', practicalplants.PP_DROUGHT_VALUES);
			assertValueOrMissing(object, 'poorNutrition', practicalplants.PP_BOOLEAN_VALUES);
			assertValueOrMissing(object, 'wind', practicalplants.PP_BOOLEAN_VALUES);
			assertValueOrMissing(object, 'maritime', practicalplants.PP_BOOLEAN_VALUES);
			assertValueOrMissing(object, 'pollution', practicalplants.PP_BOOLEAN_VALUES);
			assertValueOrMissing(object, 'ecosystemNiche', practicalplants.PP_ECOSYSTEM_NICHE_VALUES);
			assertValueOrMissing(object, 'lifeCycle', practicalplants.PP_LIFE_CYCLE_VALUES);
			assertValueOrMissing(object, 'herbaceousOrWoody', practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES);
			assertValueOrMissing(object, 'deciduousOrEvergreen', practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES);
			assertValueOrMissing(object, 'growthRate', practicalplants.PP_GROWTH_RATE_VALUES);
			assertValueOrMissing(object, 'matureMeasurementUnit', practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES);
			assertValueOrMissing(object, 'matureHeight', practicalplants.PP_MATURE_HEIGHT_VALUES);
			assertValueOrMissing(object, 'matureWidth', practicalplants.PP_MATURE_WIDTH_VALUES);
			assertValueOrMissing(object, 'flowerType', practicalplants.PP_FLOWER_TYPE_VALUES);
			assertValueOrMissing(object, 'pollinators', practicalplants.PP_POLLINATORS_VALUES);
			assertValueOrMissing(object, 'functions', practicalplants.PP_FUNCTIONS_VALUES);
			assertValueOrMissing(object, 'growFrom', practicalplants.PP_GROW_FROM_VALUES);
			assertValueOrMissing(object, 'cuttingType', practicalplants.PP_CUTTING_TYPE_VALUES);
			assertValueOrMissing(object, 'fertility', practicalplants.PP_FERTILITY_VALUES);
			assertValueOrMissing(object, 'rootZone', practicalplants.PP_ROOT_ZONE_VALUES);
			
			{
				/*
				 * Assert that some properties that describe a range of values (for
				 * example soil ph, from acid to alkaline) also contain all of the
				 * values in between. This quality is used by the companionship
				 * algorithm.
				 */
				assertArrayPropertyOfRangeHasAllValuesInBetween(object.soilPh, practicalplants.ALL_SOIL_PH_VALUES);
				assertArrayPropertyOfRangeHasAllValuesInBetween(object.soilTexture, practicalplants.ALL_SOIL_TEXTURE_VALUES);
				assertArrayPropertyOfRangeHasAllValuesInBetween(object.soilWaterRetention, practicalplants.ALL_SOIL_WATER_RETENTION_VALUES);
			}
		});
	}).timeout(0);
	
	it('no duplicates in enum definitions', () => {
		assertNoDuplicates(practicalplants.PP_BOOLEAN_VALUES);
		assertNoDuplicates(practicalplants.PP_SOIL_TEXTURE_VALUES);
		assertNoDuplicates(practicalplants.PP_SOIL_WATER_RETENTION_VALUES);
		assertNoDuplicates(practicalplants.PP_SHADE_VALUES);
		assertNoDuplicates(practicalplants.PP_SUN_VALUES);
		assertNoDuplicates(practicalplants.PP_WATER_VALUES);
		assertNoDuplicates(practicalplants.PP_DROUGHT_VALUES);
		assertNoDuplicates(practicalplants.PP_ECOSYSTEM_NICHE_VALUES);
		assertNoDuplicates(practicalplants.PP_LIFE_CYCLE_VALUES);
		assertNoDuplicates(practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES);
		assertNoDuplicates(practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES);
		assertNoDuplicates(practicalplants.PP_GROWTH_RATE_VALUES);
		assertNoDuplicates(practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES);
		assertNoDuplicates(practicalplants.PP_FLOWER_TYPE_VALUES);
		assertNoDuplicates(practicalplants.PP_POLLINATORS_VALUES);
		assertNoDuplicates(practicalplants.PP_FUNCTIONS_VALUES);
		assertNoDuplicates(practicalplants.PP_FUNCTIONS_VALUES);
		assertNoDuplicates(practicalplants.PP_GROW_FROM_VALUES);
		assertNoDuplicates(practicalplants.PP_CUTTING_TYPE_VALUES);
		assertNoDuplicates(practicalplants.PP_FERTILITY_VALUES);
		assertNoDuplicates(practicalplants.PP_ROOT_ZONE_VALUES);
	});
});
