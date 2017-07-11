import {expect} from 'chai';
import validation from '../../helpers/data_validation';
import Crop from '../../models/crop';
import {Types} from 'mongoose';
const {ObjectId} = Types;

describe('data_validation', () => {
  let validId;
  describe('#idValidation()', () => {
    it("should reject invalid ids", () => {
      const ids = ['12345', 'JF(jrf9Nd3gkd0fj2ln  j F)'];
      const res = {};
      const req = {ids: ids};
      let error;
      const next = (err) => {
        error = err;
      }
      validation.idValidator(req, res, next);
      expect(error.status).to.equal(400);
    });
    it("should accept valid ids", () => {
      const ids = [ObjectId(), ObjectId()];
      const req = {ids: ids};
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      }
      validation.idValidator(req, res, next);
      expect(typeof error).to.equal('undefined');
      expect(req.ids).to.equal(ids);
    });
  });
  describe('#getCompanionshipScores()', () => {
    const ids = [ObjectId()];
    const a = ObjectId();
    const b = ObjectId();
    const c = ObjectId();
    const sample = [[
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
    it("should return 1 or -1 for correct crops", () => {
      const results = validation.getCompanionshipScores(sample, ids);
      expect(results[a]).to.equal(1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(1);
    });
    it("should override positive companionships with a negative", () => {
      ids.push(ObjectId());
      const d = ObjectId();
      const newData = [
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
      const results = validation.getCompanionshipScores(sample, ids);
      const max = 6;
      expect(results[a]).to.equal(-1);
      expect(results[b]).to.equal(-1);
      expect(results[c]).to.equal(3/6);
      expect(results[d]).to.equal(2/6);
    });
  });
  describe('#fetchModel()', () => {
    it("should throw 404 on nonexistent id", () => {
      return Crop.findOne({}).then((crop) => {
        validId = crop._id;
        const ids = [ObjectId(), crop._id];
        const req = {ids: ids};
        const res = {};
        return fetchModelError(Crop, "crops", req, res).then((err) => {
          expect(err.status).to.equal(404);
        });
      });
    });
    it("should save models for valid id", () => {
      const ids = [validId, validId];
      const req = {ids: ids};
      const res = {};
      return fetchModelError(Crop, "crops", req, res).then((err) => {
        expect(req.crops).to.have.length(2);
        expect(typeof err).to.equal('undefined');
      });
    });
  });
  describe("#checkModel()", () => {
    it("should return false for invalid id", () => {
      const ids = [ObjectId(), validId];
      const req = {ids: ids};
      const res = {};
      return checkModelError(Crop, req, res).then((err) => {
        expect(err.status).to.equal(404);
      });
    });
    it("should return true for valid id", () => {
      const ids = [validId, validId];
      const req = {ids: ids};
      const res = {};
      return checkModelError(Crop, req, res).then((err) => {
        expect(typeof error).to.equal('undefined');
        expect(req.ids).to.equal(ids);
      });
    });
  });
});

function fetchModelError(model, modelName, req, res) {
  return new Promise((resolve) => {
    const next = (err) => {
      resolve(err);
    }
    validation.fetchModel(model, modelName)(req, res, next);
  })
}

function checkModelError(model, req, res) {
  return new Promise((resolve) => {
    const next = (err) => {
      resolve(err);
    }
    validation.checkModel(model)(req, res, next);
  })
}
