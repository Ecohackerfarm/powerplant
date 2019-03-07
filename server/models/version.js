const mongoose = require('mongoose');

/**
 * This collection contains version information for the current state of the
 * database, and it is used to determine when to send updates to clients.
 */
const versionSchema = new mongoose.Schema({
  crops: {
    type: Number,
    required: true
  },
  cropRelationships: {
    type: Number,
    required: true
  }
});

const Version = mongoose.model('Version', versionSchema);

module.exports = Version;
