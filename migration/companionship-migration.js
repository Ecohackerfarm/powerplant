var Companionship = require('../models/companionship');
var Crop = require('../models/crop');
var firebase = require('firebase');

module.exports = migrateCompanionships;

function migrateCompanionships() {
  // Delete all previous entries
  Companionship.find({}).remove().exec();


  var search = firebase.database().ref('/').once('value');
  search.then(function(snapshot) {
    var data = snapshot.val();
    var companionships = data.companions;
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
      // need to add each companionshipship in firebase to mongo
      var savePromises = [];
      for (var crop1 in companionships) {
        for (var crop2 in companionships[crop1]) {
          var compatibility = companionships[crop1][crop2] === "good";
          savePromises.push(new Companionship({crop1: fbToMongo[crop1], crop2: fbToMongo[crop2], compatibility: compatibility}).save());
          console.log(crop1 + " and " + crop2 + " are " + compatibility);
          // want to make sure it doesn't get added twice
          delete companionships[crop2][crop1];
        }
      }
      Promise.all(savePromises).then(function(companionships) {
        var cropPromises = [];
        console.log("Saved all companionships...starting to save references in Crops");
        companionships.forEach(function(companionship) {
          // save reference to companionship in each of the crops
          cropPromises.push(Crop.findByIdAndUpdate(
            companionship.crop1,
            {$push: {companionships: companionship}}
          ));;
          if (!companionship.crop1.equals(companionship.crop2)) {
            cropPromises.push(Crop.findByIdAndUpdate(
              companionship.crop2,
              {$push: {companionships: companionship}}
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
