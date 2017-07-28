import {expect} from 'chai';
import * as types from '/client/actions/types';
import {title} from '/client/reducers';
import {defaultState} from '/client/reducers/title';
import {expectNoActionForAllBut as sanityCheck} from './Helper';


describe("title reducer", () => {
  const {SET_TITLE} = types;
  const actions = [];
  describe("SET_TITLE", () => {
    const type = SET_TITLE;
    actions.push(type);
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
  describe("everything else", () => {
    it("should do nothing", () => {
      const state = "title";
      const action = {
        title: "newTitle"
      };
      sanityCheck(title, actions, state, action);
    });
  });
});
