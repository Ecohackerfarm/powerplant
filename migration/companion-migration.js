var Companion = require('../models/companion');
var Plant = require('../models/plant');
var firebase = require('firebase');

module.exports = migrateCompanions;

function migrateCompanions() {
  // Delete all previous entries
  Companion.find({}).remove().exec();


  var search = firebase.database().ref('/').once('value');
  search.then(function(snapshot) {
    var data = snapshot.val();
    var companions = data.companions;
    var plants = data.plants;

    // we need to replace all the firebase keys with mongodb keys otherwise it's a huge pain
    // to do this we will create a map from firebase keys to mongodb keys
    var fbToMongo = {};
    var fbIds = Object.keys(plants);
    var promises = fbIds.map(function(id) {
      return Plant.findOne({name: plants[id].name}).exec();
    });
    Promise.all(promises).then(function(data) {
      // now data holds a list of all the plants IN THE SAME ORDER AS fbIds
      var mongoIds = data.map(function(plant) {
        return plant._id;
      });
      for (var i=0; i<mongoIds.length; i++) {
        fbToMongo[fbIds[i]] = mongoIds[i];
      }

      // now we have a map from firebase ids to mongo ids
      // need to add each companionship in firebase to mongo
      var savePromises = [];
      for (var plant1 in companions) {
        for (var plant2 in companions[plant1]) {
          var compatibility = companions[plant1][plant2] === "good";
          savePromises.push(new Companion({plant1: fbToMongo[plant1], plant2: fbToMongo[plant2], compatibility: compatibility}).save());
          console.log(plant1 + " and " + plant2 + " are " + compatibility);
          // want to make sure it doesn't get added twice
          delete companions[plant2][plant1];
        }
      }
      Promise.all(savePromises).then(function(companions) {
        var plantPromises = [];
        console.log("Saved all companions...starting to save references in Plants");
        companions.forEach(function(companion) {
          // save reference to companion in each of the plants
          plantPromises.push(Plant.findByIdAndUpdate(
            companion.plant1,
            {$push: {companions: companion}}
          ));;
          if (!companion.plant1.equals(companion.plant2)) {
            plantPromises.push(Plant.findByIdAndUpdate(
              companion.plant2,
              {$push: {companions: companion}}
            ));
          }
        });
        Promise.all(plantPromises).then(function(plants) {
          console.log("Migration complete!");
          process.exit();
        });
      });
    });
  });
}
