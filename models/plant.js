module.exports.getById = function(id, cb) {

}

module.exports.getByPrefix = function(prefix, cb) {
  // make a query to firebase
  var promise = getPromiseForPlantSearch(database, plantName);
  promise.then(function(snapshot) {
    cb(null, snapshot.val() || {});
  });
}
