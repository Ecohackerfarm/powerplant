/**
 * @namespace version
 * @memberof client.reducers
 */

const { VERSION_UPDATED } = require('../actions');

const initialState = {
  crops: 0
};

function version(state = initialState, action) {
  switch (action.type) {
    case VERSION_UPDATED:
      console.log('VERSION_UPDATED');
      return Object.assign({}, state, action.version);
    default:
      return state;
  }
}

module.exports = {
  version
};
