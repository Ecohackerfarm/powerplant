var expect = require('chai').expect;
var rootDir = '../../..';
var Crop = require(rootDir + "/models/crop");
var Companionship = require(rootDir + "/models/companionship");

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

module.exports.createTestCrop = function(cb) {
  new Crop({
    name: "test",
    display_name: "test"
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
        compatibility: true
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
