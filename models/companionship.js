var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// TODO: change compatibility to an integer and also change the scoring system and the migration code
var companionshipSchema = new Schema({
  crop1: {type: ObjectId, ref: "Crop"},
  crop2: {type: ObjectId, ref: "Crop"},
  description: String,
  compatibility: Boolean
});

var Companionship = mongoose.model('Companionship', companionshipSchema);
module.exports = Companionship;
