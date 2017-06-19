var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companionSchema = new Schema({
  plant1: Schema.Types.ObjectId,
  plant2: Schema.Types.ObjectId,
  compatibility: Boolean
});

var Companion = mongoose.model('Companion', companionSchema);
module.exports = Companion;
