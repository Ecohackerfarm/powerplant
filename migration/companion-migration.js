module.exports = function() {
  // this is the code to migrate firebase to mongodb
  var Companion = require('../models/companion');
  var Plant = require('../models/plant');
  var firebase = require('firebase');

  migrateCompanions();
}

function migrateCompanions() {
  Companion.find({}).remove().exec();
  var search = firebase.database().ref('/').once('value');
  search.then(function(snapshot) {
    var data = snapshot.val();
    var companions = data.companions;
    var plants = data.plants;

    // this is the gross part
    for (var plant in companions) {
      // list all companions ids (firebase) of the plant
      var cList = Object.keys(companions[plant]);
      var plantName1 = plants[plant].name;

      // need to find the mongo db id of this plant
      Plant.findOne({name: plantName1}, function(err, plant1) {
        cList.forEach(function(compId) {
          var plantName2 = plants[compId].name;

          // now we need to find the mongo db id of the second plant
          Plant.findOne({name: plantName2}, function(err, plant2) {
            var id1 = plant1._id;
            var id2 = plant2._id;
            var compatibility = companions[plant][compId];

            // query to find if the companionship already exists in the database
            Plant.find().or([{plant1: id1, plant2: id2}, {plant1: id2, plant2: id1}]).exec(function(err, result) {
              // make sure not to duplicate companions
              if (result.length === 0) {
                new Companion({
                  plant1: id1,
                  plant2: id2,
                  compatibility: compatibility === "good"
                }).save();
              }
            });
          });
        });
      });

    }
  });
}
