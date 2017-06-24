var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var companionSchema = new Schema({
  plant1: {type: ObjectId, ref: "Plant"},
  plant2: {type: ObjectId, ref: "Plant"},
  description: String,
  compatibility: Boolean
});

var Companion = mongoose.model('Companion', companionSchema);
module.exports = Companion;
