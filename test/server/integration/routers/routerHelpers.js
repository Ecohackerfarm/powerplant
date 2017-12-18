import { expect } from 'chai';
import Crop from '/server/models/crop';
import CropRelationship from '/server/models/crop-relationship';

import * as myself from './routerHelpers'; // import myself (it's ok es6 supports cyclic imports)
export default myself; // this allows default importing AND named importing

// Helper functions for integration tests go here

export function sendForm(request, data) {
	return request
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send(data);
}

export function randString() {
	return Math.random()
		.toString(36)
		.substring(7);
}

export function allStrings(array) {
	return array.every(item => {
		return typeof item === 'string';
	});
}

export function checkCropRelationship(item) {
	expect(item).to.contain.all.keys('crop0', 'crop1', 'compatibility');
	expect(item.crop0 <= item.crop1).to.equal(true);
}

const sessionString = 'test' + module.exports.randString();

export function createTestCrop(cb) {
	new Crop({
		commonName: sessionString,
		binomialName: sessionString
	}).save((err, crop) => {
		cb(crop);
	});
}

export function createTestCropRelationship(cb) {
	module.exports.createTestCrop(crop0 => {
		module.exports.createTestCrop(crop1 => {
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
export function cleanDb(cb) {
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
