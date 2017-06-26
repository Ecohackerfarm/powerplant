var rootDir = '../../../../';
var rootUrl = '/api/companionships';
var jsonType = 'application/json; charset=utf-8';

var expect = require('chai').expect;
var express = require('express');
var app = require(rootDir + 'app.js');
var request = require('supertest')(app);
var Helper = require('../routerHelpers');
var checkCompanionship = Helper.checkCompanionship;
var sendForm = Helper.sendForm;
var ObjectId = require('mongoose').Types.ObjectId;

describe(rootUrl + "/", function() {
  var url = rootUrl + "/";
  describe("GET", function() {
    it("should return an array of companionships", function() {
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
    it("should create a new companionship with valid existing crop ids", function() {

    });
    it("should 400 with invalid or nonexistent crop ids", function() {
      var newComp = {
        crop1: ObjectId(),
        crop2: ObjectId(),
        compatibility: false
      };

    });
  });
});

describe(rootUrl + "/scores", function() {
  describe("GET", function() {
    it("should return an empty array with no query", function() {

    });
    it("should return correct scores with all valid crop ids", function() {

    });
    it("should 400 if there is a malformed crop id", function() {

    });
    it("should 404 if there is a nonexistent crop id", function() {

    });
  });
});

describe(rootUrl + "/:id", function() {
  describe("GET", function() {
    it("should 400 for a malformed id", function() {

    });
    it("should 404 for a nonexistent id", function() {

    });
    it("should return the correct companionship for a valid id", function() {

    });
  });
  describe("PUT", function() {
    it("should modify the specified fields of a valid id", function() {

    });
  });
  describe("DELETE", function() {
    it("should delete a valid companionship", function() {

    });
  });
});
