var Companionship = require('../models/companionship');
var Crop = require('../models/crop');
var firebase = require('firebase');

module.exports = function() {
  migrateCrops(require('./companionship-migration'));
}

function migrateCrops(callback) {
  Crop.find({}).remove().exec();


  var search = firebase.database().ref('/plants').once('value');
  search.then(function(snapshot) {
    var data = snapshot.val();
    var promises = Object.keys(data).map(function (crop) {
      var cropModel = new Crop({
        name: data[crop].name,
        display_name: data[crop].display_name,
        alternate_name: "",
        compaions: []
      });
      console.log("Saving crop: " + data[crop].name);
      return cropModel.save();
    });
    Promise.all(promises).then(function (result) {
      callback();
    });
  });
}
