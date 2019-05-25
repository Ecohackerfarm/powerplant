/**
 * @namespace WorkerManager
 * @memberof worker
 */

const Worker = require('worker-loader!./worker.js');
const store = require('../redux/store.js');

class WorkerManager {
  constructor() {
    this.worker = new Worker();
    this.worker.onmessage = (e) => {
      const { id, method, result } = e.data;

      if (id) {
        const entry = this.queue[id];
        this.queue[id] = null;
        entry.resolve(result);
      } else {
        // Internal messages
        store.dispatch(result);
      }
    };

    this.idCounter = 0;
    this.queue = {};
  }

  /**
   * @param {String} method
   * @param {Array} parameters
   * @return {Promise}
   */
  delegate(method, ...parameters) {
    const message = {
      id: this.generateId(),
      method: method,
      parameters: parameters
    };

    const entry = {};
    entry.message = message;
    entry.promise = new Promise((resolve, reject) => {
      entry.resolve = resolve;
      entry.reject  = reject;
    });

    this.queue[message.id] = entry;

    this.worker.postMessage(message);

    return entry.promise;
  }

  /**
   * Generate unique ID for worker call promises. 0 is reserved for internal messages such as
   * PouchDB synchronization.
   */
  generateId() {
    while ((this.idCounter == 0) || this.queue[this.idCounter]) {
      this.idCounter++;
    }

    return this.idCounter;
  }
}

const workerManager = new WorkerManager();

module.exports = workerManager;
