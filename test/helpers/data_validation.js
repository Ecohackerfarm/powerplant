var expect = require('chai').expect;
var validation = require('../../helpers/data_validation');
var Crop = require('../../models/crop');
var mongoose = require('mongoose');
var objId = mongoose.Types.ObjectId;

describe('data_validation', function() {
  var validId;
  describe('#idValidation()', function() {
    it("should reject invalid ids", function() {
      var ids = ['12345', 'JF(jrf9Nd3gkd0fj2ln  j F)'];
      var res = {};
      var req = {ids: ids};
      var next = function(err) {
        error = err;
      }
      validation.idValidator(req, res, next);
      expect(error.status).to.equal(400);
    });
    it("should accept valid ids", function() {
      var ids = [objId(), objId()];
      var req = {ids: ids};
      var res = {};
      var next = function(err) {
        error = err;
      }
      validation.idValidator(req, res, next);
      expect(typeof error).to.equal('undefined');
      expect(req.ids).to.equal(ids);
    });
  });
  describe('#getCompanionshipScores()', function() {
    var ids = [objId()];
    var a = objId();
    var b = objId();
    var c = objId();
    var sample = [[
      {crop1: ids[0],
      crop2: a,
      compatibility: true},
      {crop1: b,
      crop2: ids[0],
      compatibility: false},
      {crop1: ids[0],
      crop2: c,
      compatibility: true}
    ]];
    it("should return 1 or -1 for correct crops", function() {
      var results = validation.getCompanionshipScores(sample, ids);
      expect(results[a]).to.equal(1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(1);
    });
    it("should override positive companionships with a negative", function() {
      ids.push(objId());
      var d = objId();
      var newData = [
        {crop1: ids[1],
        crop2: a,
        compatibility: false},
        {crop1: b,
        crop2: ids[1],
        compatibility: true},
        {crop1: ids[1],
        crop2: d,
        compatibility: true}
      ];
      sample.push(newData);
      var results = validation.getCompanionshipScores(sample, ids);
      expect(results[a]).to.equal(-1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(.5);
      expect(results[d]).to.equal(.5);
    });
  });
  describe('#fetchModel()', function() {
    it("should throw 404 on nonexistent id", function() {
      return Crop.findOne({}).then(function(crop) {
        validId = crop._id;
        var ids = [objId(), crop._id];
        var req = {ids: ids};
        var res = {};
        return fetchModelError(Crop, "crops", req, res).then(function(err) {
          expect(err.status).to.equal(404);
        });
      });
    });
    it("should save models for valid id", function() {
      var ids = [validId, validId];
      var req = {ids: ids};
      var res = {};
      return fetchModelError(Crop, "crops", req, res).then(function(err) {
        expect(req.crops).to.have.length(2);
        expect(typeof err).to.equal('undefined');
      });
    });
  });
  describe("#checkModel()", function() {
    it("should return false for invalid id", function() {
      var ids = [objId(), validId];
      var req = {ids: ids};
      var res = {};
      return checkModelError(Crop, req, res).then(function(err) {
        expect(err.status).to.equal(404);
      });
    });
    it("should return true for valid id", function() {
      var ids = [validId, validId];
      var req = {ids: ids};
      var res = {};
      return checkModelError(Crop, req, res).then(function(err) {
        expect(typeof error).to.equal('undefined');
        expect(req.ids).to.equal(ids);
      });
    });
  });
});

function fetchModelError(model, modelName, req, res) {
  return new Promise(function(resolve) {
    var next = function(err) {
      resolve(err);
    }
    validation.fetchModel(model, modelName)(req, res, next);
  })
}

function checkModelError(model, req, res) {
  return new Promise(function(resolve) {
    var next = function(err) {
      resolve(err);
    }
    validation.checkModel(model)(req, res, next);
  })
}
