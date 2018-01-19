import mongoose from 'mongoose';

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const bedSchema = new Schema({
	name: { type: String, required: true },
	soil_type: { type: Number, min: 0, max: 2 }
});

/**
 * @constructor
 * @alias Location
 * @param {Object} location
 * @param {(ObjectId|server.models.User)} location.user ID of the user owning this location
 * @param {Object} [location.loc] Geographic location details
 * @param {String} [location.loc.type="Point"] Location type, likely never needs to be anything but the default
 * @param {Number[]} location.loc.coordinates Array of two coordinates in the order [lng, lat]
 * @param {String} location.loc.address Address of the location
 */
const locationSchema = new Schema({
	user: { type: ObjectId, index: true, required: true },
	name: String,
	loc: {
		type: { type: String, default: 'Point' },
		coordinates: { type: [Number], default: [0, 0] },
		address: String
	},
	beds: [bedSchema]
});

/*
 * MongoDB has 2dsphere index that allows quick queries based on geographic
 * proximity. TODO: For what is this useful in powerplant?
 */
locationSchema.index({
	loc: '2dsphere'
});

/*
 * Type is required for 2dsphere index. It should always be 'Point'.
 */
locationSchema.pre('save', function(next) {
	this.loc.type = 'Point';
	next();
});

export default mongoose.model('Location', locationSchema);
