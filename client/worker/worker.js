/**
 * @namespace worker
 * @memberof client.worker
 */

const {
  getCropGroups,
  getCompatibleCrops
} = require('../../shared/companions.js');
const pouchdb = require('../pouchdb.js');

onmessage = function(e) {
  const { id, method, parameters } = e.data;

  const result = {
    id: id,
    method: method,
    result: null
  };

  switch (method) {
    case 'getCropGroups':
      result.result = getCropGroups(...parameters);
      postMessage(result);
      break;
    case 'getCompatibleCrops':
      result.result = getCompatibleCrops(...parameters);
      postMessage(result);
      break;
    case 'pouchdb.put':
      const crop = parameters[0];
      local.get(crop._id).then(response => {
        local
          .put(Object.assign({}, response, crop, { _rev: response._rev }))
          .then(response => {
            postMessage(result);
          })
          .catch(error => {
            console.info(error);
          });
      });
      break;
  }
};

function postReduxAction(action) {
  const message = {
    id: 0,
    method: null,
    result: action
  };

  postMessage(message);
}

let local = pouchdb.run(postReduxAction);
