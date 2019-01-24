const mongoose = require('mongoose');
const practicalplants = require('../../db/practicalplants.js');

/**
 * A Crop Model representing a plant or mushrooms species
 * TODO: write documentation for params see practicalplants.org
 *
 * @constructor
 * @alias Crop
 * @param {Object} crop object holding the attributes
 * @param {String} crop.commonName name the crop is commonly known
 * @param {String} crop.binomialName latin unique binomial name,
 *                                   note: sometimes names can change
 * @param {String} crop.cuttingType
 * @param {String} crop.deciduousOrEvergreen
 * @param {String} crop.drought
 * @param {String} crop.ecosystemNiche
 * @param {String} crop.fertility
 * @param {String} crop.flowerType
 * @param {String} crop.functions
 * @param {String} crop.growFrom
 * @param {String} crop.growthRate
 * @param {String} crop.averageMinTemperature
 * @param {String} crop.herbaceousOrWoody
 * @param {String} crop.lifeCycle
 * @param {String} crop.maritime
 * @param {String} crop.matureHeight
 * @param {String} crop.matureMeasurementUnit
 * @param {String} crop.matureWidth
 * @param {String} crop.pollinators
 * @param {String} crop.pollution
 * @param {String} crop.poorNutrition
 * @param {String} crop.rootZone
 * @param {String} crop.shade
 * @param {String} crop.soilPh
 * @param {String} crop.soilTexture
 * @param {String} crop.soilWaterRetention
 * @param {String} crop.sun
 * @param {String} crop.water
 * @param {String} crop.wind
 *
 */
const cropSchema = new mongoose.Schema({
	binomialName: {
		type: String,
		index: true,
		required: true
	},
	commonName: {
		type: String
	},
	cuttingType: [{
		type: String,
		enum: practicalplants.PP_CUTTING_TYPE_VALUES.concat([null])
	}],
	deciduousOrEvergreen: {
		type: String,
		enum: practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES.concat([null])
	},
	drought: {
		type: String,
		enum: practicalplants.PP_DROUGHT_VALUES.concat([null])
	},
	ecosystemNiche: [{
		type: String,
		enum: practicalplants.PP_ECOSYSTEM_NICHE_VALUES.concat([null])
	}],
	fertility: [{
		type: String,
		enum: practicalplants.PP_FERTILITY_VALUES.concat([null])
	}],
	flowerType: {
		type: String,
		enum: practicalplants.PP_FLOWER_TYPE_VALUES.concat([null])
	},
	functions: [{
		type: String,
		enum: practicalplants.PP_FUNCTIONS_VALUES.concat([null])
	}],
	growFrom: [{
		type: String,
		enum: practicalplants.PP_GROW_FROM_VALUES.concat([null])
	}],
	growthRate: {
		type: String,
		enum: practicalplants.PP_GROWTH_RATE_VALUES.concat([null])
	},
	herbaceousOrWoody: {
		type: String,
		enum: practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES.concat([null])
	},
	lifeCycle: [{
		type: String,
		enum: practicalplants.PP_LIFE_CYCLE_VALUES.concat([null])
	}],
	maritime: {
		type: Boolean
	},
	matureHeight: {
		type: Number,
		min: 0
	},
	matureMeasurementUnit: {
		type: String,
		enum: practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES.concat([null])
	},
	matureWidth: {
		type: Number,
		min: 0
	},
	pollinators: [{
		type: String,
		enum: practicalplants.PP_POLLINATORS_VALUES.concat([null]),
	}],
	pollution: {
		type: Boolean
	},
	poorNutrition: {
		type: Boolean
	},
	rootZone: {
		type: String,
		enum: practicalplants.PP_ROOT_ZONE_VALUES.concat([null])
	},
	shade: {
		type: String,
		enum: practicalplants.PP_SHADE_VALUES.concat([null])
	},
	soilPh: [{
		type: String,
		enum: practicalplants.PP_SOIL_PH_VALUES.concat([null])
	}],
	soilTexture: [{
		type: String,
		enum: practicalplants.PP_SOIL_TEXTURE_VALUES.concat([null])
	}],
	soilWaterRetention: [{
		type: String,
		enum: practicalplants.PP_SOIL_WATER_RETENTION_VALUES.concat([null])
	}],
	sun: {
		type: String,
		enum: practicalplants.PP_SUN_VALUES.concat([null])
	},
	water: {
		type: String,
		enum: practicalplants.PP_WATER_VALUES.concat([null])
	},
	wind: {
		type: Boolean
	}
});

/**
 * Query builder method that finds crops by name.
 *
 * @param {String} name
 * @return {Query}
 */
cropSchema.query.byName = function(name) {
	const regex = new RegExp(name, 'i');
	return this.find({
		$or: [{ commonName: regex }, { binomialName: regex }]
	}).sort('commonName binomialName');
};

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
