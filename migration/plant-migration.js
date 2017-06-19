// so this file is the result of several hours of trying to get the data to port from firebase
// it is very far from my best work
// i am a little ashamed of it to be honest
// but it worked, and now we have the data in mongodb

// what ended up working was to run it once and only migrate plants
// and then run it again and only migrate companions
// it was either that or have like 5 nested callbacks

module.exports = function() {
  // this is the code to migrate firebase to mongodb
  var Companion = require('../models/companion');
  var Plant = require('../models/plant');
  var firebase = require('firebase');

  migratePlants();
}

function migratePlants(callback) {
  Plant.find({}).remove().exec();


  var search = firebase.database().ref('/plants').once('value');
  search.then(function(snapshot) {
    var data = snapshot.val();
    for (var plant in snapshot.val()) {
      var plantModel = new Plant({
        name: data[plant].name,
        display_name: data[plant].display_name,
        alternate_name: ""
      });
      console.log("Saving plant: " + data[plant].name);
      plantModel.save();
    }
  });
}
