var rootDir = '../../../../';
var rootUrl = '/api/crops';
var jsonType = 'application/json; charset=utf-8';

var expect = require('chai').expect;
var express = require('express');
var app = require(rootDir + 'app.js');
var Helper = require('../routerHelpers');
var sendForm = Helper.sendForm;
var randString = Helper.randString;
var allStrings = Helper.allStrings;
var request = require('supertest')(app);
var ObjectId = require('mongoose').Types.ObjectId;

var createdCropId;
describe(rootUrl + "/", function() {
  describe("GET", function() {
    it("should return all crops with no arguments", function() {
      return request.get(rootUrl)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(res.body).to.have.length.above(64);
        });
    });
    it("should return crops matching a query string", function() {
      return request.get(rootUrl + "?name=apple")
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(res.body).to.have.length.above(0);
          res.body.forEach(function(apple) {
            expect(apple.name).to.include("apple");
          });
        });
    });
    it("should return no crops for gibberish query string", function() {
      return request.get(rootUrl + "?name=jf93 FJ(Fiojs")
        .expect(200)
        .expect('Content-Type', jsonType)
        .expect([]);
    });
    it("should not populate the list of companionships", function() {
      return request.get(rootUrl + "?name=apple")
        .then(function(res) {
          res.body.forEach(function(apple) {
            expect(apple).to.have.property('companionships').and.to.satisfy(allStrings);
          });
        });
    });
  });
  describe("POST", function() {
    var crop = {
      name: "my test crop",
      display_name: "Simon's crop for testing"
    };
    it("should create new crop from just name and display name", function() {
      return sendForm(request.post(rootUrl), crop)
        .expect(201)
        .then(function(res) {
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("name").and.to.equal(crop.name);
          expect(res.body).to.have.property("display_name").and.to.equal(crop.display_name);
        });
    });
    it("should provide the location of the new resource", function() {
      return sendForm(request.post(rootUrl), crop)
        .expect(201)
        .then(function(res) {
          expect(res.header.location).to.include(rootUrl);
        });
    });
    it("should 400 missing name or display", function() {
      delete crop.name;
      return sendForm(request.post(rootUrl), crop)
        .expect(400);
    });
  });
});

describe(rootUrl + "/:cropId", function() {
  var testId;
  before(function() {
    return request.get(rootUrl + "?name=test")
      .then(function(res) {
        testId = res.body[0]._id;
      });
  });
  describe("GET", function() {
    it("should 400 a bad id", function() {
      return request.get(rootUrl + "/a9jfw0aw903j j (JF) fjw")
        .expect(400)
        .expect('Content-Type', jsonType);
    });
    it("should 404 a valid but nonexistent crop id", function() {
      return request.get(rootUrl + "/" + ObjectId().toString())
        .expect(404)
        .expect('Content-Type', jsonType);
    });
    it("should return the specified crop", function() {
      return request.get(rootUrl + "/" + testId)
        .expect(200)
        .then(function(res) {
          var test = res.body;
          expect(test).to.have.property('name').and.to.match(RegExp('test', 'i'));
        });
    });
    it("should not populate companionship list", function() {
      return request.get(rootUrl + "/" + testId)
        .expect(200)
        .then(function(res) {
          var test = res.body;
          expect(test).to.have.property('companionships').and.to.satisfy(allStrings);
        });
    });
  });
  describe("PUT", function() {
    it("should make the specified valid changes", function() {
      var changes = {display_name: randString(),
                     alternate_display: randString()};
      return sendForm(request.put(rootUrl + "/" + testId), changes)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          var newTest = res.body;
          expect(newTest).to.have.property('display_name').and.to.equal(changes.display_name);
          expect(newTest).to.have.property('alternate_display').and.to.equal(changes.alternate_display);
        })
    });
    it("should not effect invalid field changes", function() {
      var changes = {blahblah: randString()};
      return sendForm(request.put(rootUrl + "/" + testId), changes)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(res.body).to.not.have.property('blahblah');
        });
    });
    it("should not allow ID changes", function() {
      var changes = {_id: ObjectId().toString()};
      return sendForm(request.put(rootUrl + "/" + testId), changes)
        .expect(400);
    });
  });
  describe("DELETE", function() {
    it("should delete a valid crop", function() {
      return request.delete(rootUrl + "/" + testId)
        .expect(204);
    });
  });
});

describe(rootUrl + "/:cropId/companionships", function() {
  var testId;
  before(function() {
    return request.get(rootUrl + "?name=apple")
      .then(function(res) {
        testId = res.body[0]._id;
      });
  });
  describe("GET", function() {
    it("should fetch an array", function() {
      return request.get(rootUrl + "/" + testId + "/companionships")
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(res.body).to.have.length.above(0);
        });
    });
    it("should populate companionships", function() {
      return request.get(rootUrl + "/" + testId + "/companionships")
        .expect(200)
        .then(function(res) {
          res.body.forEach(function(item) {
            expect(item).to.contain.all.keys('crop1', 'crop2', 'compatibility');
          })
        });
    });
    it("should only fetch matching companionships", function() {
      return request.get(rootUrl + "/" + testId + "/companionships")
        .expect(200)
        .then(function(res) {
          res.body.forEach(function(item) {
            expect(item).to.satisfy(function(item) {
              return item.crop1 === testId || item.crop2 === testId;
            });
          });
        });
    });
  });
});

describe(rootUrl + "/:cropId1/companionships/:cropId2", function() {
  var appleId;
  var testId;
  before(function() {
    return request.get(rootUrl + "?name=apple")
      .then(function(res) {
        appleId = res.body[0]._id;
        return request.get(rootUrl + "?name=test")
          .then(function(res) {
            testId = res.body[0]._id;
          });
      });
  });
  describe("GET", function() {
    it("should provide proper location on existing companionship", function() {
      return request.get(rootUrl + "/" + appleId + "/companionships/" + appleId)
        .expect(303)
        .then(function(res) {
          return request.get(res.header.location)
            .expect(200)
            .then(function(res) {
              var c = res.body;
              expect(c).to.contain.all.keys('crop1', 'crop2', 'compatibility');
              expect(c).to.satisfy(function(c) {
                return c.crop1._id === appleId && c.crop2._id === appleId;
              });
            });
        });
    });
    it("should response 204 on existing crops but nonexistent companionship", function() {
      return request.get(rootUrl + "/" + appleId + "/companionships/" + testId)
        .expect(204);
    });
  })
});
