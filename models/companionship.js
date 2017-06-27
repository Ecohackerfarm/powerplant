var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var explain = require('mongoose-explain');
// var idExists = require('mongoose-idexists');

// TODO: change compatibility to an integer and also change the scoring system and the migration code
// TODO: Get code working to validate crops to make sure they exist
var companionshipSchema = new Schema({
  crop1: {type: ObjectId, ref: "Crop", index: true, required: true},
  crop2: {type: ObjectId, ref: "Crop", index: true, required: true},
  description: String,
  compatibility: {type: Boolean, required: true}
});

companionshipSchema.index({crop1: 1, crop2: 1}, {unique: true});

companionshipSchema.query.byCrop = function(crop1, crop2) {
  if (typeof crop1 !== 'undefined' && typeof crop2 !== 'undefined') {
    if (crop1 > crop2) {
      var tmp = crop1;
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

companionshipSchema.pre('save', function(next) {
  // middleware to make sure we only save our crops in alphabetic order
  if (this.crop1 > this.crop2) {
    var tmp = this.crop1;
    this.crop1 = this.crop2;
    this.crop2 = tmp;
  }
  next();
});

var Companionship = mongoose.model('Companionship', companionshipSchema);
module.exports = Companionship;
