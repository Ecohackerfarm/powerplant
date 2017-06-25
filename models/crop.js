var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var cropSchema = new Schema({
  name: String,
  display_name: String,
  alternate_display: String,
  companions: [{type: ObjectId, ref: "Companion"}],
  preferred_soil: String,
  preferred_climate: String
});
var Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
