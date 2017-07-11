var rootDir = '../../../..';
var rootUrl = '/api/companionships';
var jsonType = 'application/json; charset=utf-8';

var expect = require('chai').expect;
var app = require(rootDir + '/app.js');
var request = require('supertest')(app);
var Helper = require('../routerHelpers');
var checkCompanionship = Helper.checkCompanionship;
var sendForm = Helper.sendForm;
var randString = Helper.randString;
var ObjectId = require('mongoose').Types.ObjectId;
var Companionship = require(rootDir + "/models/companionship");

describe(rootUrl + "/", function() {
  var url = rootUrl + "/";
  describe("GET", function() {
    it("should return an array of companionships", function() {
      this.timeout(5000);
      return request.get(url)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(res.body).to.be.an('array').and.to.have.length.above(0);
          res.body.forEach(checkCompanionship);
        });
    });
  });
  describe("POST", function() {
    var crop1, crop2;
    before(function() {
      var cropData = {
        name: randString(),
        display_name: "Snozzberry"
      };
      return sendForm(request.post('/api/crops'), cropData)
        .then(function(res) {
          crop1 = res.body._id.toString();
          return sendForm(request.post('/api/crops'), cropData)
            .then(function(res) {
              crop2 = res.body._id.toString();
            });
        });
    });
    it("should create a new companionship with valid existing crop ids", function() {
      var newComp = {
        crop1: crop1,
        crop2: crop2,
        compatibility: -1
      };
      return sendForm(request.post(url), newComp)
        .expect(201);
    });
    it("should 303 if trying to create a companionship that already exists", function() {
      var newComp = {
        crop1: crop2,
        crop2: crop1,
        compatibility: -1
      };
      return sendForm(request.post(url), newComp)
        .expect(303)
        .then(function(res) {
          expect(res.header).to.have.property('location').and.to.contain("/api/companionships/");
        });
    });
    it("should 404 with nonexistent crop ids", function() {
      // TODO: This is a BIZARRE bug
      // when using a nonexistent but valid object id here, the error object gets printed to the console
      // i see no print statement in the entire project that prints an error object
      // figure out where this is coming from?
      var newComp = {
        crop1: ObjectId().toString(),
        crop2: ObjectId().toString(),
        compatibility: false
      };
      return sendForm(request.post(url), newComp)
        .expect(404);
    });
    it("should 400 with invalid crop ids", function() {
      var newComp = {
        crop1: "ja;fsifa093",
        crop2: "jf930wjf93wf",
        compatiblity: true
      };
      return sendForm(request.post(url), newComp)
        .expect(400);
    });
  });
});

describe(rootUrl + "/scores", function() {
  var url = rootUrl + "/scores";
  describe("GET", function() {
    var appleId, potatoId, beanId;
    before(function() {
      // fetching 3 crops
      var cropUrl = '/api/crops?name=';
      return request.get(cropUrl + "apple")
        .then(function(appleRes) {
          appleId = appleRes.body[0]._id;
          return request.get(cropUrl + "potato")
            .then(function(potatoRes) {
              potatoId = potatoRes.body[0]._id;
              return request.get(cropUrl + "bean")
                .then(function(beanRes) {
                  beanId = beanRes.body[0]._id;
                });
            });
        });
    });
    it("should 400 with no query", function() {
      return request.get(url)
        .expect(400);
    });
    it("should return numerical scores with all valid crop ids", function() {
      return request.get(url + "?id=" + appleId + "," + potatoId + "," + beanId)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(Object.keys(res.body)).to.have.length.above(0);
          for (var id in res.body) {
            expect(res.body[id]).to.be.within(-1, 1);
          }
        });
    });
    it("should 400 if there is a malformed crop id", function() {
      return request.get(url + "?id=" + appleId + ",fa3j9w0f a0f9jwf")
        .expect(400);
    });
    it("should 404 if there is a nonexistent crop id", function() {
      return request.get(url + "?id=" + appleId + "," + ObjectId().toString())
        .expect(404);
    });
  });
});

describe(rootUrl + "/:id", function() {
  var url = rootUrl;
  var validId;
  var validCompatibility;
  var valid;
  before(function(done) {
    Helper.createTestCompanionship(function(comp) {
      validId = comp._id.toString();
      validCompatibility = comp.compatibility;
      valid = comp;
      done();
    })
  });
  describe("GET", function() {
    it("should 400 for a malformed id", function() {
      return request.get(url + "/a")
        .expect(400);
    });
    it("should 404 for a nonexistent id", function() {
      return request.get(url + "/" + ObjectId().toString())
        .expect(404);
    });
    it("should return the correct companionship for a valid id", function() {
      return request.get(url + "/" + validId)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(res.body).to.have.property('_id').and.to.equal(validId)
        });
    });
  });
  describe("PUT", function() {
    it("should modify the specified fields of a valid id", function() {
      var changes = {
        compatibility: validCompatibility>0?-1:3
      };
      return sendForm(request.put(url + "/" + validId), changes)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then(function(res) {
          expect(res.body).to.have.property('_id').and.to.equal(validId);
          expect(res.body).to.have.property('compatibility').and.to.equal(changes.compatibility);
        });
    });
    it("should 404 on nonexistent id", function() {
      return sendForm(request.put(url + "/" + ObjectId().toString()), {})
        .expect(404);
    });
    it("should 400 on invalid id", function() {
      return sendForm(request.put(url + "/afw2j"), {})
        .expect(400);
    });
  });
  describe("DELETE", function() {
    it("should delete a valid companionship", function() {
      return request.delete(url + "/" + validId)
        .expect(200)
        .then(function(res) {
          return Companionship.findById(validId, function(err, comp) {
            expect(comp).to.be.null;
          });
        });
    });
  });
});
