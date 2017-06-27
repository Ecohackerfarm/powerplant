var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// var idExists = require('mongoose-idexists');

var cropSchema = new Schema({
  name: {type: String, index: true, required: true},
  display_name: {type: String, required: true},
  alternate_display: String,
  companionships: [{type: ObjectId, ref: "Companionship"}],
  preferred_soil: String,
  preferred_climate: String
});

var Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
