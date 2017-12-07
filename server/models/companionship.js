import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// import explain from 'mongoose-explain';
// import idExists from 'mongoose-idexists';

// TODO: Get code working to validate crops to make sure they exist
/**
 * @constructor
 * @alias Companionship
 * @param {Object} companionship
 * @param {(ObectId|server.models.Crop)} companionship.crop1 id referencing the first crop
 * @param {(ObectId|server.models.Crop)} companionship.crop2 id referencing the second crop
 * @param {String} [companionship.description] description of the relationship
 * @param {Number} companionship.compatibility compatibility score for the companionship
 */
const companionshipSchema = new Schema({
	crop1: { type: ObjectId, ref: 'Organism', index: true, required: true },
	crop2: { type: ObjectId, ref: 'Organism', index: true, required: true },
	description: String,
	compatibility: { type: Number, required: true, min: -1, max: 3 }
});

/**
 * @param {Crop} crop
 * @return {Boolean}
 */
companionshipSchema.methods.containsCrop = function(crop) {
	const id = crop._id.toString();
	return this.crop1 == id || this.crop2 == id;
};

companionshipSchema.index({ crop1: 1, crop2: 1 }, { unique: true });

// custom query allowing for things like Companionship.find().byCrop(crop1, crop2)
// much nicer than Companionship.find({$or: etc...})
/**
 * Custom query for searching for a companionship by crop id
 * @example
 * // finds all companionships involving cropId
 * Companionship.find().byCrop(cropId).exec((err, results) => {
 *   // do something with results
 * })
 * @alias byCrop
 * @memberof server.models.Companionship
 * @static
 * @param  {(ObjectId|server.models.Crop)} crop1
 * @param  {(ObjectId|server.models.Crop)} [crop2]
 * @return {Mongoose.Query}
 */
companionshipSchema.query.byCrop = function(crop1, crop2) {
	if (typeof crop1 !== 'undefined' && typeof crop2 !== 'undefined') {
		if (crop1 > crop2) {
			const tmp = crop1;
			crop1 = crop2;
			crop2 = tmp;
		}
		return this.find({ crop1: crop1, crop2: crop2 });
	} else {
		return this.find({
			$or: [{ crop1: crop1 }, { crop2: crop1 }]
		});
	}
};

// pre-save hook to make sure that even if the crops somehow got mixed up, when they are saved they are in alphabetic order
companionshipSchema.pre('save', function(next) {
	// middleware to make sure we only save our crops in alphabetic order
	if (this.crop1 > this.crop2) {
		const tmp = this.crop1;
		this.crop1 = this.crop2;
		this.crop2 = tmp;
	}
	next();
});

const Companionship = mongoose.model('Companionship', companionshipSchema);
export default Companionship;
