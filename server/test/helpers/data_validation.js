import {expect} from 'chai';
import validation from '../../helpers/data_validation';
import Crop from '../../models/crop';
import {Types} from 'mongoose';
const {ObjectId} = Types;

describe('data_validation', function() {
  var validId;
  describe('#idValidation()', function() {
    it("should reject invalid ids", function() {
      var ids = ['12345', 'JF(jrf9Nd3gkd0fj2ln  j F)'];
      var res = {};
      var req = {ids: ids};
      var error;
      var next = function(err) {
        error = err;
      }
      validation.idValidator(req, res, next);
      expect(error.status).to.equal(400);
    });
    it("should accept valid ids", function() {
      var ids = [ObjectId(), ObjectId()];
      var req = {ids: ids};
      var res = {};
      var error;
      var next = function(err) {
        error = err;
      }
      validation.idValidator(req, res, next);
      expect(typeof error).to.equal('undefined');
      expect(req.ids).to.equal(ids);
    });
  });
  describe('#getCompanionshipScores()', function() {
    var ids = [ObjectId()];
    var a = ObjectId();
    var b = ObjectId();
    var c = ObjectId();
    var sample = [[
      {crop1: ids[0],
      crop2: a,
      compatibility: 3},
      {crop1: b,
      crop2: ids[0],
      compatibility: -1},
      {crop1: ids[0],
      crop2: c,
      compatibility: 3}
    ]];
    it("should return 1 or -1 for correct crops", function() {
      var results = validation.getCompanionshipScores(sample, ids);
      expect(results[a]).to.equal(1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(1);
    });
    it("should override positive companionships with a negative", function() {
      ids.push(ObjectId());
      var d = ObjectId();
      var newData = [
        {crop1: ids[1],
        crop2: a,
        compatibility: -1},
        {crop1: b,
        crop2: ids[1],
        compatibility: 3},
        {crop1: ids[1],
        crop2: d,
        compatibility: 2}
      ];
      sample.push(newData);
      var results = validation.getCompanionshipScores(sample, ids);
      var max = 6;
      expect(results[a]).to.equal(-1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(3/6);
      expect(results[d]).to.equal(2/6);
    });
  });
  describe('#fetchModel()', function() {
    it("should throw 404 on nonexistent id", function() {
      return Crop.findOne({}).then(function(crop) {
        validId = crop._id;
        var ids = [ObjectId(), crop._id];
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
      var ids = [ObjectId(), validId];
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
