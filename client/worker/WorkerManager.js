/**
 * @namespace WorkerManager
 * @memberof worker
 */

const Worker = require('worker-loader!./worker.js');

class WorkerManager {
  constructor() {
    this.worker = new Worker();
    this.worker.onmessage = (e) => {
      const method = e.data.method;
      const result = e.data.result;
      
      const entry = this.queue[method];
      this.queue[method] = null;
      entry.resolve(result);
    };
    
    this.queue = {
      'getCropGroups': null,
      'getCompatibleCrops': null
    };
  }
  
  /**
   * @param {String} method
   * @param {Array} parameters
   * @return {Promise}
   */
  delegate(method, ...parameters) {
    let promise;
    if (this.queue[method]) {
      promise = this.queue[method].promise;
    } else {
      const entry = {};
      entry.promise = promise = new Promise((resolve, reject) => {
        entry.resolve = resolve;
        entry.reject = reject;
      });
      this.queue[method] = entry;
    }
    
    this.worker.postMessage({
      method: method,
      parameters: parameters
    });
    
    return promise;
  }
}

const workerManager = new WorkerManager();

module.exports = {
  workerManager
};
