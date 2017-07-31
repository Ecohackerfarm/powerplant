import { expect } from 'chai';
import Crop from '/server/models/crop';
import Companionship from '/server/models/companionship';

import * as myself from './routerHelpers'; // import myself (it's ok es6 supports cyclic imports)
export default myself; // this allows default importing AND named importing

// Helper functions for integration tests go here

export function sendForm(request, data) {
	return request
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.send(data);
}

export function randString() {
	return Math.random().toString(36).substring(7);
}

export function allStrings(array) {
	return array.every(item => {
		return typeof item === 'string';
	});
}

export function checkCompanionship(item) {
	expect(item).to.contain.all.keys('crop1', 'crop2', 'compatibility');
	expect(item.crop1 <= item.crop2).to.equal(true);
}

const sessionString = 'test' + module.exports.randString();

export function createTestCrop(cb) {
	new Crop({
		name: sessionString,
		display_name: sessionString
	}).save((err, crop) => {
		cb(crop);
	});
}

export function createTestCompanionship(cb) {
	module.exports.createTestCrop(crop1 => {
		module.exports.createTestCrop(crop2 => {
			new Companionship({
				crop1: crop1,
				crop2: crop2,
				compatibility: 3
			}).save((err, comp) => {
				crop1.companionships.push(comp._id);
				crop1.save(() => {
					crop2.companionships.push(comp._id);
					crop2.save(() => {
						cb(comp);
					});
				});
			});
		});
	});
}

// remove all companionships with things with the word
export function cleanDb(cb) {
	Crop.find().byName(sessionString).exec((err, list) => {
		console.log('Found ' + list.length + ' test crop instances');
		list.forEach(crop => {
			Companionship.find().byCrop(crop).exec((err, comps) => {
				console.log('Found ' + comps.length + ' test companionship instances');
				comps.forEach(c => {
					c.remove();
				});
			});
			crop.remove();
		});
	});
}
