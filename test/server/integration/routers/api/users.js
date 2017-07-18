const rootUrl = '/api/users';
const jsonType = 'application/json; charset=utf-8';

import {expect} from 'chai';
import app from  '/server/app';
import {sendForm} from '../routerHelpers';
import supertest from 'supertest';
import User from '/server/models/user';
import {Types} from 'mongoose';

const {ObjectId} = Types;
const request = supertest(app);

let userId;
export const user = {
  username: "testUser",
  email: "testEmail@email.com",
  password: "testPassword"
};

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
        done();
      })
    }
    else {
      userId = newUser._id.toString();
      user._id = _id;
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
      this.retries(3);
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
