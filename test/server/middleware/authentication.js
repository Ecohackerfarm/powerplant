import {expect} from 'chai';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import User from '/server/models/user';
import {authenticate as auth} from '/server/middleware/authentication';

describe("authentication middleware", () => {
  describe("#authenticate()", () => {
    it("should do nothing with no authentication header", (done) => {
      const req = {
        headers: {}
      };
      const res = {};
      const reqCopy = Object.assign({}, req);
      const resCopy = Object.assign({}, res);
      const next = (err) => {
        expect(err).to.be.undefined;
        expect(req).to.eql(reqCopy); // deep equals check
        expect(res).to.eql(resCopy);
        done();
      }
      auth(req, res, next);
    });
    it("should 401 with invalid authentication header", (done) => {
      const req = {
        headers: {
          authorization: "afjwafjaw 0fa9w3f'ag'a38)*GY$" //button mashing
        }
      }
      const res = {};
      const next = (err) => {
        expect(err).to.have.property('status').and.to.equal(401);
        done();
      }
      auth(req, res, next);
    });
    it("should 404 with nonexistent user", (done) => {
      const badToken = jwt.sign({
        id: "blasjldfkas",
        username: "noonehasthisusernameihope",
        email: "FJ()WFJ(DXCVN)"
      }, jwtSecret);
      const req = {
        headers: {
          authorization: 'Bearer ' + badToken
        }
      }
      const res = {};
      const next = (err) => {
        expect(err).to.have.property('status').and.to.equal(404);
        done();
      }
      auth(req, res, next);
    });
    it("should set req.user with valid user", (done) => {
      User.findOne({}, (err, user) => {
        expect(err).to.be.null;
        return user;
      })
      .then((user) => {
        const token = jwt.sign({
          id: user._id,
          username: user.username,
          email: user.email
        }, jwtSecret);
        const req = {
          headers: {
            authorization: 'Bearer ' + token
          }
        }
        const res = {};
        const next = (err) => {
          expect(err).to.be.undefined;
          expect(req).to.have.property('user');
          expect(req.user).to.have.property('_id');
          expect(req.user._id.toString()).to.equal(user.id);
          done();
        }
        auth(req, res, next);
      })
    });
  });
});
