var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var cropSchema = new Schema({
  name: {type: String, index: true},
  display_name: String,
  alternate_display: String,
  companionships: [{type: ObjectId, ref: "Companionship"}],
  preferred_soil: String,
  preferred_climate: String
});

var Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
