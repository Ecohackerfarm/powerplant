import {expect} from 'chai';
import * as types from '/client/actions/types';
import {title} from '/client/reducers/title';

describe("title reducer", function() {
  const {SET_TITLE} = types;
  const actions = [SET_TITLE];
  describe("SET_TITLE", () => {
    it("should return the new title", () => {
      const myTitle = "test title goes here";
      const oldTitle = "oldTitle";
      const action = {
        type: SET_TITLE,
        title: myTitle
      }
      expect(title(oldTitle, action)).to.equal(myTitle);
      expect(title(oldTitle, action)).not.to.equal(oldTitle);
    });
  });
  // little bit of a sanity check
  // make sure we don't modify the store when we're not supposed to
  describe.skip("everything else", () => {
    it("should do nothing", () => {
      const myTitle = "another test title";
      Object.keys(types)
      .filter(type => (type in actions))
      .forEach((type) => {
        console.log("Type: " + type);
        const action = {type};
        expect(title(myTitle, action)).to.equal(myTitle);
      })
    });
  });
});
