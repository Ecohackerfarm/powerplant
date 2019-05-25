/**
 * PouchDB-related code that makes the app offline-first, allowing the
 * database to be edited offline and to be synchronized with the server.
 *
 * @namespace pouchdb
 * @memberof client
 */

const PouchDB = require('pouchdb').default;
const actions = require('./redux/actions.js');

/**
 * @param {Function} dispatch  Function that dispatches an action to Redux store.
 */
function run(dispatch) {
  const local  = new PouchDB('crops-local');
  const remote = new PouchDB('http://185.117.118.9:8080/db/crops');

  local.sync(remote, {
    live:         true,
    retry:        true,
    include_docs: true,
  }).on('change', (info) => {
    console.log('pouchdb change');
    console.log(info);

    dispatchChanges(info.change.docs, dispatch);
  }).on('paused', (err) => {
    console.log('pouchdb paused');
    console.log(err);
  }).on('active', () => {
    console.log('pouchdb active');
  }).on('denied', (err) => {
    console.log('pouchdb denied');
    console.log(err);
  }).on('complete', (info) => {
    console.log('pouchdb complete');
    console.log(info);
  }).on('error', (err) => {
    console.log('pouchdb error');
    console.log(err);
  });

  return local;
}

function dispatchChanges(docs, dispatch) {
  const removedDocuments = docs.filter((doc) => doc._deleted);
  const updatedDocuments = docs.filter((doc) => !removedDocuments.includes(doc));

  if (removedDocuments.length > 0) {
    dispatch(actions.removeCrop(removedDocuments));
  }
  if (updatedDocuments.length > 0) {
    dispatch(actions.updateCrop(updatedDocuments));
  }
}

module.exports = {
  run
};
