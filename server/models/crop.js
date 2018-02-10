const mongoose = require('mongoose');

/**
 * @constructor
 * @alias Crop
 * @param {Object} crop
 * @param {String} crop.commonName
 * @param {String} crop.binomialName
 */
const cropSchema = new mongoose.Schema({
	commonName: { type: String },
	binomialName: { type: String, index: true, required: true }
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
