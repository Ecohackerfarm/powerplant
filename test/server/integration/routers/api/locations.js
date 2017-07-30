const rootUrl = '/api/locations';
const jsonType = 'application/json; charset=utf-8';

import {expect} from 'chai';
import app from  '/server/app';
import {sendForm,
  randString,
  allStrings,
  createTestCrop,
  createTestCompanionship} from '../routerHelpers';
import supertest from 'supertest';
import Location from "/server/models/location";
import User from '/server/models/user';
import {Types} from 'mongoose';
import {user as testUser} from './users';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';

const {ObjectId} = Types;
const request = supertest(app);

let locId;
let userId;
let token;

before(() => {
  // need to add a location to our test user
  return User.find().byUsername(testUser.username).exec((err, {_id}) => {
    userId = _id.toString();
    token = jwt.sign({
      id: userId,
      username: testUser.username,
      email: testUser.email
    }, jwtSecret);
    return userId;
  })
  .then((userId) => {
    return new Location({
      user: userId,
      name: "test location"
    }).save((err, loc) => {
      locId = loc._id.toString();
    })
  })
});

describe(rootUrl + "/", () => {
  let newLoc;
  before(() => {
    newLoc = {
      user: userId,
      name: "my location 1",
      loc: [122.2, 121.1]
    };
  });
  describe("POST", () => {
    it("should 401 if not authenticated", () => {
      return sendForm(request.post(rootUrl + "/"), newLoc)
        .expect(401);
    });
    it("should create a new location if authenticated", () => {
      return sendForm(request.post(rootUrl + "/"), newLoc)
        .set('authorization', 'Bearer ' + token)
        .expect(201)
        .expect('Content-Type', jsonType)
        .then((res) => {
          const loc = res.body;
          expect(loc).to.have.property('user').and.to.equal(userId);
        })
    });
  });
});

describe(rootUrl + "/id/:locId", () => {
  describe("GET", () => {
    it("should 401 without authorization", function() {
      this.timeout(15000);
      const url = rootUrl + "/id/" + locId;
      console.log(url);
      return request.get(url)
      .expect(401);
    });
    it("should return location with authorization", () => {
      return request.get(rootUrl + "/id/" + locId)
      .set('authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', jsonType)
      .then((res) => {
        expect(res.body).to.have.property('_id').and.to.equal(locId);
      })
    });
    it("should 404 with nonexistent", () => {
      const token = jwt.sign({
        id: "this is a made up user id",
        username: "this is a made up username",
        email: "this is a made up email"
      }, jwtSecret);
      return request.get(rootUrl + "/id/" + locId)
      .set('authorization', 'Bearer ' + token)
      .expect(404)
    });
  });
  describe("PUT", () => {
    it("should update the location with proper authorization", () => {
      const changes = {name: randString(), loc: {address: randString, coordinates: [1, 1]}};
      return sendForm(request.put(rootUrl + "/id/" + locId), changes)
      .set('authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', jsonType)
      .then((res) => {
        expect(res.body).to.have.property('name').and.to.equal(changes.name);
      })
    })
    it("should not update with invalid data", () => {
      const changes = {name: {a: 1}};
      return sendForm(request.put(rootUrl + "/id/" + locId), changes)
      .set('authorization', 'Bearer ' + token)
      .expect(400)
    })
  })
  describe("DELETE", () => {
    it("should delete a location with authorization", () => {
      return request.delete(rootUrl + "/id/" + locId)
      .set('authorization', 'Bearer ' + token)
      .expect(200);
    })
  })
});
