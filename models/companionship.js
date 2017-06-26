var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var explain = require('mongoose-explain');

// TODO: change compatibility to an integer and also change the scoring system and the migration code
var companionshipSchema = new Schema({
  crop1: {type: ObjectId, ref: "Crop", index: true},
  crop2: {type: ObjectId, ref: "Crop", index: true},
  description: String,
  compatibility: Boolean
});

// companionshipSchema.plugin(explain);

var Companionship = mongoose.model('Companionship', companionshipSchema);
module.exports = Companionship;
