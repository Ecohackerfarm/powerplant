import {expect} from 'chai';
import * as types from '/client/actions/types';
import {locations} from '/client/reducers';
import {expectNoActionForAllBut as sanityCheck} from './Helper';

describe.skip("EDIT_LOCATION", () => {
  const type = types.EDIT_LOCATION;
  it("should modify the properties location", () => {
    const location = {prop: "value"};
    const action = {type, location};
    const state = {};
    expect(newState).to.have.property(prop).and.to.equal("value");
    expect(newState).not.to.equal(state);
  });
});
