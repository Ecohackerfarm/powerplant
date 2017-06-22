var expect = require('chai').expect;
var validation = require('../../helpers/data_validation');
var Plant = require('../../models/plant');
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
  describe('#getCompanionScores()', function() {
    var ids = [objId()];
    var a = objId();
    var b = objId();
    var c = objId();
    var sample = [[
      {plant1: ids[0],
      plant2: a,
      compatibility: true},
      {plant1: b,
      plant2: ids[0],
      compatibility: false},
      {plant1: ids[0],
      plant2: c,
      compatibility: true}
    ]];
    it("should return 1 or -1 for correct plants", function() {
      var results = validation.getCompanionScores(sample, ids);
      expect(results[a]).to.equal(1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(1);
    });
    it("should override positive companions with a negative", function() {
      ids.push(objId());
      var d = objId();
      var newData = [
        {plant1: ids[1],
        plant2: a,
        compatibility: false},
        {plant1: b,
        plant2: ids[1],
        compatibility: true},
        {plant1: ids[1],
        plant2: d,
        compatibility: true}
      ];
      sample.push(newData);
      var results = validation.getCompanionScores(sample, ids);
      expect(results[a]).to.equal(-1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(.5);
      expect(results[d]).to.equal(.5);
    });
  });
  describe('#fetchModel()', function() {
    it("should throw 404 on nonexistant id", function() {
      return Plant.findOne({}).then(function(plant) {
        validId = plant._id;
        var ids = [objId(), plant._id];
        var req = {ids: ids};
        var res = {};
        return fetchModelError(Plant, "plants", req, res).then(function(err) {
          expect(err.status).to.equal(404);
        });
      });
    });
    it("should save models for valid id", function() {
      var ids = [validId, validId];
      var req = {ids: ids};
      var res = {};
      return fetchModelError(Plant, "plants", req, res).then(function(err) {
        expect(req.plants).to.have.length(2);
        expect(typeof err).to.equal('undefined');
      });
    });
  });
  describe("#checkModel()", function() {
    it("should return false for invalid id", function() {
      var ids = [objId(), validId];
      var req = {ids: ids};
      var res = {};
      return checkModelError(Plant, req, res).then(function(err) {
        expect(err.status).to.equal(404);
      });
    });
    it("should return true for valid id", function() {
      var ids = [validId, validId];
      var req = {ids: ids};
      var res = {};
      return checkModelError(Plant, req, res).then(function(err) {
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
