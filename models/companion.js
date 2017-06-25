var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// TODO: change compatibility to an integer and also change the scoring system and the migration code
var companionSchema = new Schema({
  crop1: {type: ObjectId, ref: "Crop"},
  crop2: {type: ObjectId, ref: "Crop"},
  description: String,
  compatibility: Boolean
});

var Companion = mongoose.model('Companion', companionSchema);
module.exports = Companion;
