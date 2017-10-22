import mongoose from 'mongoose';

const organismSchema = new mongoose.Schema({
	commonName: { type: String },
	binomialName: { type: String, index: true, required: true }
});

/**
 * Query builder method that finds an organism by its name.
 *
 * @param {String} name
 * @return {Query}
 */
organismSchema.query.byName = function(name) {
	const regex = new RegExp(name, 'i');
	return this.find({ $or: [{ commonName: regex }, { binomialName: regex }] });
};

const Organism = mongoose.model('Organism', organismSchema);
export default Organism;
