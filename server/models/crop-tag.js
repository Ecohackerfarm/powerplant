const mongoose = require('mongoose');

/**
 * Tag represents a group of crops that share a common property.
 *
 * TODO Add field 'description' that describes the common property.
 */
const cropTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

const CropTag = mongoose.model('CropTag', cropTagSchema);

module.exports = CropTag;
