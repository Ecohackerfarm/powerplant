import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/**
 * @constructor
 * @alias CropRelationship
 * @param {Object} relationship
 * @param {(ObectId|server.models.Crop)} relationship.crop0 ID referencing the first crop
 * @param {(ObectId|server.models.Crop)} relationship.crop1 ID referencing the second crop
 * @param {Number} relationship.compatibility Compatibility score for the relationship
 * @param {String} relationship.description Description of the relationship
 */
const cropRelationshipSchema = new Schema({
	crop0: { type: ObjectId, ref: 'Crop', index: true, required: true },
	crop1: { type: ObjectId, ref: 'Crop', index: true, required: true },
	compatibility: { type: Number, required: true, min: -1, max: 3 },
	description: String
});

/**
 * Check if the relationship includes the given crop.
 * 
 * @param {Crop} crop
 * @return {Boolean}
 */
cropRelationshipSchema.methods.containsCrop = function(crop) {
	const id = crop._id.toString();
	return (this.crop0 == id) || (this.crop1 == id);
};

cropRelationshipSchema.index({ crop0: 1, crop1: 1 }, { unique: true });

/**
 * Custom query for searching for a companionship by crop id or ids.
 * 
 * @example
 * // finds all companionships involving cropId
 * CropRelationship.find().byCrop(cropId).exec((err, results) => {
 *   // do something with results
 * })
 * @alias byCrop
 * @memberof server.models.CropRelationship
 * @static
 * @param  {(ObjectId|server.models.Crop)} crop0
 * @param  {(ObjectId|server.models.Crop)} crop1
 * @return {Mongoose.Query}
 */
cropRelationshipSchema.query.byCrop = function(crop0, crop1) {
	if ((typeof crop0 !== 'undefined') && (typeof crop1 !== 'undefined')) {
		if (crop0 > crop1) {
			const tmp = crop0;
			crop0 = crop1;
			crop1 = tmp;
		}
		return this.find({ crop0: crop0, crop1: crop1 });
	} else {
		return this.find({
			$or: [{ crop0: crop0 }, { crop1: crop0 }]
		});
	}
};

/**
 * Pre-save hook to make sure that even if the crops somehow got mixed up,
 * when they are saved they are in alphabetic order.
 */
cropRelationshipSchema.pre('save', function(next) {
	if (this.crop0 > this.crop1) {
		const tmp = this.crop0;
		this.crop0 = this.crop1;
		this.crop1 = tmp;
	}
	next();
});

const CropRelationship = mongoose.model('CropRelationship', cropRelationshipSchema);
export default CropRelationship;
