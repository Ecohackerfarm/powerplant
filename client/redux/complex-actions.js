/**
 * Redux action creators that return functions.
 *
 * @namespace complex-actions
 * @memberof redux
 */

const workerManager = require('../worker/WorkerManager.js');
const actions = require('./actions.js');

function updateCropAndSynchronize(crop) {
  return (dispatch, getState) => {
    console.info('updateCropAndSynchronize');
    console.info(crop);
    workerManager.delegate('pouchdb.put', crop).then((doc) => {
      dispatch(actions.updateCrop(crop));
    });
  };
}

module.exports = {
  updateCropAndSynchronize,
};
