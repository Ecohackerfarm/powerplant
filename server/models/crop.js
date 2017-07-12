import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// import idExists from 'mongoose-idexists';

const cropSchema = new Schema({
  name: {type: String, index: true, required: true},
  display_name: {type: String, required: true},
  alternate_display: String,
  companionships: [{type: ObjectId, ref: "Companionship"}],
  preferred_soil: String,
  preferred_climate: String
});

cropSchema.query.byName = function(name) {
  const regex = new RegExp(name, "i");
  return this.find({name: regex});
}

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
