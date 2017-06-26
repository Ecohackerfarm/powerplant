var expect = require('chai').expect;

module.exports.sendForm = function(request, data) {
  return request
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send(data);
}

module.exports.randString = function() {
  return Math.random().toString(36).substring(7);
}

module.exports.allStrings = function(array) {
  return array.every(function(item) {
    return typeof item === 'string';
  });
}

module.exports.checkCompanionship = function(item) {
  expect(item).to.contain.all.keys('crop1', 'crop2', 'compatibility');
}
