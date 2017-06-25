var Companion = require('../models/companion');
var Crop = require('../models/crop');
var firebase = require('firebase');

module.exports = migrateCompanions;

function migrateCompanions() {
  // Delete all previous entries
  Companion.find({}).remove().exec();


  var search = firebase.database().ref('/').once('value');
  search.then(function(snapshot) {
    var data = snapshot.val();
    var companions = data.companions;
    var crops = data.plants;

    // we need to replace all the firebase keys with mongodb keys otherwise it's a huge pain
    // to do this we will create a map from firebase keys to mongodb keys
    var fbToMongo = {};
    var fbIds = Object.keys(crops);
    var promises = fbIds.map(function(id) {
      return Crop.findOne({name: crops[id].name}).exec();
    });
    Promise.all(promises).then(function(data) {
      // now data holds a list of all the crops IN THE SAME ORDER AS fbIds
      var mongoIds = data.map(function(crop) {
        return crop._id;
      });
      for (var i=0; i<mongoIds.length; i++) {
        fbToMongo[fbIds[i]] = mongoIds[i];
      }

      // now we have a map from firebase ids to mongo ids
      // need to add each companionship in firebase to mongo
      var savePromises = [];
      for (var crop1 in companions) {
        for (var crop2 in companions[crop1]) {
          var compatibility = companions[crop1][crop2] === "good";
          savePromises.push(new Companion({crop1: fbToMongo[crop1], crop2: fbToMongo[crop2], compatibility: compatibility}).save());
          console.log(crop1 + " and " + crop2 + " are " + compatibility);
          // want to make sure it doesn't get added twice
          delete companions[crop2][crop1];
        }
      }
      Promise.all(savePromises).then(function(companions) {
        var cropPromises = [];
        console.log("Saved all companions...starting to save references in Crops");
        companions.forEach(function(companion) {
          // save reference to companion in each of the crops
          cropPromises.push(Crop.findByIdAndUpdate(
            companion.crop1,
            {$push: {companions: companion}}
          ));;
          if (!companion.crop1.equals(companion.crop2)) {
            cropPromises.push(Crop.findByIdAndUpdate(
              companion.crop2,
              {$push: {companions: companion}}
            ));
          }
        });
        Promise.all(cropPromises).then(function(crops) {
          console.log("Migration complete!");
          process.exit();
        });
      });
    });
  });
}
