import mongoose from 'mongoose';

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
export default Crop;
