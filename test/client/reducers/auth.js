import {expect} from 'chai';
import * as types from '/client/actions/types';
import {auth} from '/client/reducers';

describe("auth reducer", () => {
  describe("SET_CURRENT_USER", () => {
    const type = types.SET_CURRENT_USER;
    const user = "user";
    const action = {type, user};
    it("should set authenticated to true", () => {
      let state = {isAuthenticated: false};
      const newState = auth(state, action);
      expect(newState).to.have.property('isAuthenticated').and.be.true;
      expect(newState).not.to.equal(state);
    });
    it("should set currentUser", () => {
      let state = {isAuthenticated: false};
      const newState = auth(state, action);
      expect(newState).to.have.property('currentUser').and.to.equal(user);
      expect(newState).not.to.equal(state);
    });
  });
  describe("CREATE_USER", () => {
    it("TODO, not sure what this will do yet");
  });
  describe("LOGOUT", () => {
    const type = types.LOGOUT;
    const action = {type};
    it("should set isAuthenticated to false", () => {
      let state = {isAuthenticated: true};
      const newState = auth(state, action);
      expect(newState).to.have.property('isAuthenticated').and.be.false;
      expect(newState).not.to.equal(state);
    });
    it("should remove currentUser", () => {
      let state = {
        isAuthenticated: true,
        currentUser: "user"
      };
      const newState = auth(state, action);
      expect(newState).not.to.have.property('currentUser');
      expect(newState).not.to.equal(state);
    });
  });
});
