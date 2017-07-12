import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
import explain from 'mongoose-explain';
// import idExists from 'mongoose-idexists';

// TODO: Get code working to validate crops to make sure they exist
const companionshipSchema = new Schema({
  crop1: {type: ObjectId, ref: "Crop", index: true, required: true},
  crop2: {type: ObjectId, ref: "Crop", index: true, required: true},
  description: String,
  compatibility: {type: Number, required: true, min: -1, max: 3}
});

companionshipSchema.index({crop1: 1, crop2: 1}, {unique: true});

// custom query allowing for things like Companionship.find().byCrop(crop1, crop2)
// much nicer than Companionship.find({$or: etc...})
companionshipSchema.query.byCrop = function(crop1, crop2) {
  if (typeof crop1 !== 'undefined' && typeof crop2 !== 'undefined') {
    if (crop1 > crop2) {
      const tmp = crop1;
      crop1 = crop2;
      crop2 = tmp;
    }
    return this.find({crop1: crop1, crop2: crop2});
  }
  else {
    return this.find({$or: [
      {crop1: crop1},
      {crop2: crop1}
    ]});
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
