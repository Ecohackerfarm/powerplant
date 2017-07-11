var rootUrl = '/api';
var jsonType = 'application/json; charset=utf-8';


import {expect} from 'chai';
import express from 'express';
import app from '/server/app.js';
import supertest from 'supertest';

const request = supertest(app);

describe(rootUrl + '/*', function() {
  describe('GET', function() {
    it("should give JSON 404 for unknown route", function() {
      return request.get(rootUrl + "/fja93jf9w3jfsf.jf93jf-fj")
        .expect(404)
        .expect('Content-Type', jsonType);
    });
  });
});
