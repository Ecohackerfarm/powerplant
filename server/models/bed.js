import mongoose from 'mongoose';

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;

const bedSchema = new Schema({
	active_crops: [{ type: ObjectId, ref: 'Crop' }],
	past_crops: [{ type: ObjectId, ref: 'Crop' }],
	soil_type: { type: Number, min: 0, max: 2 },
	location: { type: ObjectId, ref: 'Location' },
	user: { type: ObjectId, ref: 'User' }
});

export default mongoose.model('Bed', bedSchema);
