const mongoose = require('mongoose');

/**
 * @constructor
 * @alias Crop
 * @param {Object} crop
 * @param {String} crop.commonName
 * @param {String} crop.binomialName
 */
const cropSchema = new mongoose.Schema({
	binomialName: { type: String, index: true, required: true },
	commonName: { type: String},
  cuttingType : {
  	type : String,
  	enum : ['semi-ripe', 'soft wood', 'root', 'hard wood', null]
  },
  deciduousOrEvergreen : {
  	type: String,
  	enum : ['deciduous', 'evergreen', null]
  },
  drought : {
  	type: String,
  	enum : ['dependent', 'tolerant', 'intolerant', null]
  },
  ecosystemNiche : {
  	type: String,
  	enum : ['canopy', 'climber', 'secondary canopy', 'soil surface', 'climber', 'shrub', 'herbaceous', 'rhizosphere', null]
  },
  fertility : {
  	type: String,
  	enum : ['self fertile', 'self sterile', null]
  },
  flowerType : {
  	type: String,
  	enum : ['hermaphrodite', 'monoecious', 'dioecious', null]
  },
  functions : {
  	type: String,
  	enum : [
			'nitrogen fixer',
			'ground cover',
			'hedge',
			'windbreak',
			'pioneer',
			'nitrogen fixer',
			'earth stabiliser',
			'green manure',
			'repellant',
			'soil builder',
			'rootstock',
			'biogenic decalcifier',
			'phytoremediation',
			'bee attractor',
			'soil conditioner',
			'pest repellent',
			null
		]
  },
  growFrom : {
  	type: String,
  	enum : [
			'seed',
			'cutting',
			'layering',
			'tuber',
			'suckers',
			'graft',
			'bulb',
			null
		]
  },
  growthRate : {
  	type: String,
  	enum : ['slow', 'moderate', 'vigorous', null]
  },
  averageMinTemperature : {
  	type: Number,
  	min: [273.15, ""],
  	max: 13
  },
  herbaceousOrWoody : {
  	type: String,
  	enum: ['herbaceous', 'woody', null]
  },
  lifeCycle : {
  	type : String,
  	enum : ['perennial', 'annual', 'biennial', null]
  },
  maritime : {
  	type : Boolean,
  },
  matureHeight : {
  	type : Number,
  	min : 0
  },
  matureMeasurementUnit : {
  	type : String,
  	//TODO: enum supported types
  },
  matureWidth : {
  	type: Number,
  	min: 0
  },
  pollinators : {
  	type: String
  },
  pollution : {
  	type: Boolean
  },
  poorNutrition : {
  	type: Boolean
  },
  rootZone : {
  	type: String,
  	enum: ['shallow', 'deep', 'surface', null]
  },
  shade : {
  	type: String,
  	enum: ['no shade', 'light shade', 'partial shade', 'permanent shade', 'permanent deep shade']
  },
  soilPh : {
  	type: PHRange
  },
  soilTexture : {
  	type : String,
  	enum : ['sandy', 'loamy', 'clay', 'heavy clay', null]
  },
  soilWaterRetention : {
  	type : String,
  	enum : ['well drained', 'moist', 'wet',null]
  },
  sun : {
  	type : String,
  	enum : ['indirect sun', 'partial sun', 'full sun',null]
  },
  water : {
  	type : String,
  	enum : ['low', 'moderate', 'high', 'aquatic',null]
  },
  wind : {
  	type : Boolean
  }
});

const PHRange = new mongoose.Schema({
	min : {
		type : Number,
		min : [0, "Minimum ph value to low"],
		max : [15, "Maximum ph value to high"]
	},
	max : {
		type : Number,
		min : [0, "Minimum ph value to low"],
		max : [15, "Maximum ph value to high"]
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
