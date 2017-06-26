var root = '../../../';
var rootUrl = '/api';


var expect = require('chai').expect;
var express = require('express');
var app = require(root + 'server.js');
var request = require('supertest')(app);

describe('GET *', function() {
  it("should give JSON 404 for unknown route", function(done) {
    return request.get(rootUrl + "/fja93jf9w3jfsf.jf93jf-fj")
      .expect(404)
      .expect('Content-Type', 'application/json', done);
  });
});
