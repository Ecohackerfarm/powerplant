var Companion = require('../models/companion');
var Plant = require('../models/plant');
var firebase = require('firebase');

module.exports = function() {
  migratePlants(require('./companion-migration'));
}

function migratePlants(callback) {
  Plant.find({}).remove().exec();


  var search = firebase.database().ref('/plants').once('value');
  search.then(function(snapshot) {
    var data = snapshot.val();
    var promises = Object.keys(data).map(function (plant) {
      var plantModel = new Plant({
        name: data[plant].name,
        display_name: data[plant].display_name,
        alternate_name: "",
        compaions: []
      });
      console.log("Saving plant: " + data[plant].name);
      return plantModel.save();
    });
    Promise.all(promises).then(function (result) {
      callback();
    });
  });
}
