import {expect} from 'chai';

import * as types from '/client/actions/types';

export const expectNoActionForAllBut = (reducer, validTypes, sampleState, sampleAction) => {
  for (let key in types) {
    const type = types[key];
    if (validTypes.indexOf(type) < 0) {
      const action = Object.assign({}, sampleAction, {type});
      const state = {...sampleState};
      const newState = reducer(state, action);
      expect(newState).to.equal(state);
    }
  }
}
