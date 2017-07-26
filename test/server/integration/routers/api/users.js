const rootUrl = '/api/users';
const jsonType = 'application/json; charset=utf-8';

import {expect} from 'chai';
import app from  '/server/app';
import {sendForm} from '../routerHelpers';
import supertest from 'supertest';
import User from '/server/models/user';
import {Types} from 'mongoose';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';

const {ObjectId} = Types;
const request = supertest(app);

let userId;
let token;
export const user = {
  username: "testUser",
  email: "testEmail@email.com",
  password: "testPassword"
};

function buildToken(id) {
  token = jwt.sign({
    id,
    username: user.username,
    email: user.email
  }, jwtSecret);
}

// creating/fetching the test user before everything
// using the done callback because it kept throwing an error
// if i return a promise and the user already exists
before((done) => {
  new User(user).save((err, newUser) => {
    if (err) {
      User.find().byUsername(user.username)
      .exec((err, {_id}) => {
        userId = _id.toString();
        user._id = _id;
        buildToken(userId);
        done();
      })
    }
    else {
      userId = newUser._id.toString();
      buildToken(userId);
      done();
    }
  });
});

describe(rootUrl + "/", () => {
  before(() => {
    return User.find().byUsername("testUser1").remove();
  });
  describe("POST", () => {
    const user = {
      username: "testUser1",
      email: "testemail1@email.com",
      password: "testPassword"
    };
    it("should create a user with valid data and return id", () => {
      return sendForm(request.post(rootUrl + "/"), user)
        .expect(201)
        .expect('Content-Type', jsonType)
        .then((res) => {
          expect(res.body).to.have.property('id');
        });
    });
    it("should 409 on duplicate user", () => {
      return sendForm(request.post(rootUrl + "/"), user)
        .expect(409);
    });
    it("should 400 a user with missing data", () => {
      const user = {
        email: "test@email.com",
        password: "testPassword"
      };
      return sendForm(request.post(rootUrl + "/"), user)
        .expect(400);
    });
    it("should 400 a user with invalid data", () => {
      const user = {
        username: "validUser",
        email: "invalidemail",
        password: "validPassword"
      };
      return sendForm(request.post(rootUrl + "/"), user)
        .expect(400);
    });
  });
});

describe(rootUrl + "/id/:userId", () => {
  describe("GET", () => {
    it("should return correct user for valid id", function() {
      return request.get(rootUrl + "/id/" + userId)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then((res) => {
          expect(res.body).to.have.property('username').and.to.equal(user.username);
          expect(res.body).to.have.property('_id').and.to.equal(userId);
        });
    });
    it("should not return password or email", () => {
      return request.get(rootUrl + "/id/" + userId)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then((res) => {
          expect(res.body).not.to.have.property('password');
          expect(res.body).not.to.have.property('email');
        });
    });
  });
});

describe(rootUrl + "/id/:userId/locations", () => {
  describe("GET", () => {
    it("should 401 if not authenticated", () => {
      return request.get(rootUrl + "/id/" + userId + "/locations")
        .expect(401);
    });
    it("should return locations if authenticated", () => {
      return request.get(rootUrl + "/id/" + userId + "/locations")
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .then((res) => {
          console.log(res.body);
        })
    });
    it("should not return locations if invalid authentication", () => {
      return request.get(rootUrl + "/id/" + userId + "/locations")
        .set('authorization', 'Bearer ' + token + 'f)(#)')
        .expect(401);
    });
    // TODO: test if a user is authenticated but accessing another users locations
  });
});
