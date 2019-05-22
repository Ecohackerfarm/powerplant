/**
 * @namespace worker
 * @memberof worker
 */

const { getCropGroups, getCompatibleCrops } = require('../../shared/companions.js');

onmessage = function(e) {
  const method = e.data.method;
  const parameters = e.data.parameters;
  
  const result = {
    method: method,
    result: null
  };
  
  switch (method) {
    case 'getCropGroups':
      result.result = getCropGroups(...parameters);
      break;
    case 'getCompatibleCrops':
      result.result = getCompatibleCrops(...parameters);
      break;
  }
  
  postMessage(result);
}
