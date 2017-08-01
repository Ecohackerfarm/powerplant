import mongoose from 'mongoose';

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

/**
 * Mongoose location model
 * @constructor
 * @alias Location
 * @param {Object} location
 * @param {(ObjectId|server.models.User)} location.user id of the user owning this location
 * @param {Object} [location.loc] the geographic location details
 * @param {String} [location.loc.type="Point"] location type, likely never needs to be anything but the default
 * @param {Number[]} location.loc.coordinates an array of two coordinates in the order [lng, lat]
 * @param {String} location.loc.address the address of the location
 */
const locationSchema = new Schema({
	user: { type: ObjectId, index: true, required: true },
	name: String,
	loc: {
		type: { type: String, default: 'Point' },
		coordinates: { type: [Number], default: [0, 0] },
		address: String
	}
});

// we can index gardens by location on a 2d sphere
// so we can select gardens in ranges of coordinates
// could be cool for visualizations
// this also allows for queries on distances
locationSchema.index({
	loc: '2dsphere'
});

// need this pre-save hook here because the type is required for
// a 2dsphere index but i don't want the user to have to bother
locationSchema.pre('save', function(next) {
	this.loc.type = 'Point';
	next();
});

export default mongoose.model('Location', locationSchema);
