const { expect } = require('chai');
const Crop = require('../../server/models/crop');
const CropRelationship = require('../../server/models/crop-relationship');

// Helper functions for integration tests go here

function sendForm(request, data) {
	return request
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send(data);
}

function randString() {
	return Math.random()
		.toString(36)
		.substring(7);
}

function allStrings(array) {
	return array.every(item => {
		return typeof item === 'string';
	});
}

function checkCropRelationship(item) {
	expect(item).to.contain.all.keys('crop0', 'crop1', 'compatibility');
	expect(item.crop0 <= item.crop1).to.equal(true);
}

const sessionString = 'test' + randString();

function createTestCrop(cb) {
	new Crop({
		commonName: sessionString,
		binomialName: sessionString
	}).save((err, crop) => {
		cb(crop);
	});
}

function createTestCropRelationship(cb) {
	createTestCrop(crop0 => {
		createTestCrop(crop1 => {
			new CropRelationship({
				crop0: crop0,
				crop1: crop1,
				compatibility: 3
			}).save((err, comp) => {
				cb(comp);
			});
		});
	});
}

// remove all companionships with things with the word
function cleanDb(cb) {
	Crop.find()
		.byName(sessionString)
		.exec((err, list) => {
			console.log('Found ' + list.length + ' test crop instances');
			list.forEach(crop => {
				CropRelationship.find()
					.byCrop(crop)
					.exec((err, comps) => {
						console.log(
							'Found ' + comps.length + ' test relationship instances'
						);
						comps.forEach(c => {
							c.remove();
						});
					});
				crop.remove();
			});
		});
}

module.exports = {
	sendForm,
	randString,
	allStrings,
	checkCropRelationship,
	createTestCrop,
	createTestCropRelationship,
	cleanDb
};
