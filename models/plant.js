// var firebase = require('firebase');
// var database = firebase.database();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plantSchema = new Schema({
  name: String,
  display_name: String,
  alternate_display: String
});

// plantSchema.methods.getById = function(id, cb) {
//   // database.ref('/').child('plants').child(req.params.plantId).once('value', function(snapshot) {
//   database.ref('/').child('plants').orderByKey().equalTo(id).once('value', function(snapshot) {
//     if (snapshot.val() === null) {
//       cb({status: 404, message: "Invalid plant ID"});
//     }
//     else {
//       cb(null, snapshot.val());
//     }
//   });
// }
//
// plantSchema.methods.searchByPrefix = function(prefix, cb) {
//   // make a query to firebase
//   var promise = getPromiseForPlantSearch(database, prefix);
//   promise.then(function(snapshot) {
//     cb(null, snapshot.val() || {});
//   });
// }
//
// plantSchema.methods.all = function(cb) {
//   database.ref('/').child("plants").once("value", function(snapshot) {
//     cb(null, snapshot.val());
//   });
// }
//
// plantSchema.methods.getCompanions = function(plantIds, cb) {
//   var promises = plantIds.map(function(item) {
//     return getPromiseForPlantCompanions(database, item);
//   });
//   // only start doing stuff once every requeset is fulfilled
//   Promise.all(promises).then(function(snapshots) {
//     companionResult = getCompanionScores(snapshots);
//     cb(null, companionResult);
//   });
// }

var Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;

// when I migrate from firebase to mongodb, these are the only functions
// that I'll need to change
// function getPromiseForPlantSearch(database, plantName) {
//   // name in db should be all lower case, allows for case insensitive search
//   plantName = plantName.toLowerCase();
//   // will give us everything with a name starting with plantName
//   return database.ref('/').child('plants').orderByChild('name').startAt(plantName).endAt(plantName + String.fromCharCode(255)).once('value');
// }
//
// function getPromiseForPlantCompanions(database, plantId) {
//   return database.ref('/').child('companions').child(plantId).once('value');
// }
