import {expect} from 'chai';
import * as types from '/client/actions/types';
import {currLocation} from '/client/reducers';

describe("currLocation reducer", () => {
  describe("SET_CURRENT_LOCATION", () => {
    const type = types.SET_CURRENT_LOCATION;
    const location = "right here";
    it("should set the Location", () => {
      const action = {type, location};
      const state = "Before location";
      const newState = currLocation(state, action);
      expect(newState).to.equal(location);
      expect(newState).not.to.equal(state);
    });
  });
});
