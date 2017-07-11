import {expect} from 'chai';
import Crop from "/server/models/crop";
import Companionship from "/server/models/companionship";

// Helper functions for integration tests go here

module.exports.sendForm = function(request, data) {
  return request
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send(data);
}

module.exports.randString = function() {
  return Math.random().toString(36).substring(7);
}

module.exports.allStrings = function(array) {
  return array.every(function(item) {
    return typeof item === 'string';
  });
}

module.exports.checkCompanionship = function(item) {
  expect(item).to.contain.all.keys('crop1', 'crop2', 'compatibility');
  expect(item.crop1 <= item.crop2).to.equal(true);
}

var sessionString = "test" + module.exports.randString();

module.exports.createTestCrop = function(cb) {
  new Crop({
    name: sessionString,
    display_name: sessionString
  }).save(function(err, crop) {
    cb(crop);
  });
}

module.exports.createTestCompanionship = function(cb) {
  module.exports.createTestCrop(function(crop1) {
    module.exports.createTestCrop(function(crop2) {
      new Companionship({
        crop1: crop1,
        crop2: crop2,
        compatibility: 3
      }).save(function(err, comp) {
        crop1.companionships.push(comp._id);
        crop1.save(function() {
          crop2.companionships.push(comp._id);
          crop2.save(function() {
            cb(comp);
          });
        });
      });
    });
  });
}

// remove all companionships with things with the word
module.exports.cleanDb = function(cb) {
  Crop.find().byName(sessionString).exec(function(err, list) {
    console.log("Found " + list.length + " test crop instances");
    list.forEach(function(crop) {
      Companionship.find().byCrop(crop).exec(function(err, comps) {
        console.log("Found " + comps.length + " test companionship instances");
        comps.forEach(function(c) {
          c.remove();
        });
      });
      crop.remove();
    });
  });
}
