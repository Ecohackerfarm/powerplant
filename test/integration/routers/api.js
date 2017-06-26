var root = '../../../';
var rootUrl = '/api';
var jsonType = 'application/json; charset=utf-8';


var expect = require('chai').expect;
var express = require('express');
var app = require(root + 'app.js');
var request = require('supertest')(app);

describe(rootUrl + '/*', function() {
  describe('GET', function() {
    it("should give JSON 404 for unknown route", function() {
      return request.get(rootUrl + "/fja93jf9w3jfsf.jf93jf-fj")
        .expect(404)
        .expect('Content-Type', jsonType);
    });
  });
});
