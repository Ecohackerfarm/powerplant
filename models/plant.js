var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plantSchema = new Schema({
  name: String,
  display_name: String,
  alternate_display: String
});
var Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;
