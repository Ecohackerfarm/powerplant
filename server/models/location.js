import mongoose from 'mongoose';

const {Schema} = mongoose;
const ObjectId = Schema.Types.ObjectId;

const locationSchema = new Schema({
  user: {type: ObjectId, index: true, required: true},
  name: String,
  loc: {type: {type: String, default: "Point"},
    coordinates: {type: [], default: [0, 0]}
  }
})

// we can index gardens by location on a 2d sphere
// so we can select gardens in ranges of coordinates
// could be cool for visualizations
// this also allows for queries on distances
locationSchema.index({
  loc: '2dsphere'
});

export default mongoose.model('Location', locationSchema);
