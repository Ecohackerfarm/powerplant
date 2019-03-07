/**
 * Holds global objects.
 *
 * @namespace client
 */

const WorkerManager = require('./WorkerManager.js');

const workerManager = new WorkerManager();

module.exports = {
  workerManager
};
