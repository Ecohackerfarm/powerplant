import express from 'express';
import Crop from '/server/models/crop.js';
import Companionship from '/server/models/companionship.js';
import { idValidator, escapeRegEx } from '/server/middleware/data-validation';
import { getDocuments, getDocument, doGet, doPut, doDelete } from '/server/middleware';
import { scheduler } from '/server';
import { ReadWriteTask } from 'async-task-schedulers';

const router = express.Router();

// All routes have the base route /crops

router.route('/')
	.get((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let crops;
			if (typeof req.query.name !== 'undefined') {
				const cropName = escapeRegEx(req.query.name);
				try {
					crops = await Crop.find().byName(cropName).exec();
				} catch (exception) {
					return next({ status: 500, message: 'Error fetching crops' });
				}
			} else {
				try {
					crops = await Crop.find({}).exec();
				} catch (exception) {
					return next({ status: 500, message: 'Error fetching crops' });
				}
			}
			res.json(crops);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], false));
	}).post((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let crop;
			try {
				crop = await new Crop(req.body).save();
			} catch (exception) {
				return next({ status: 400, message: 'Error saving crop' });
			}
			
			res.location('/api/crops/' + crop._id);
			res.status(201).json(crop);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], true));
	});

router.route('/:cropId')
	.get((req, res, next) => {
		scheduler.push(new ReadWriteTask(doGet, [req, res, next, Crop, req.params.cropId], false));
	}).put((req, res, next) => {
		scheduler.push(new ReadWriteTask(doPut, [req, res, next, Crop, req.params.cropId], true));
	}).delete((req, res, next) => {
		scheduler.push(new ReadWriteTask(doDelete, [req, res, next, Crop, req.params.cropId], true));
	});

// all associated companionship objects of the given cropid
router.route('/:cropId/companionships')
	.get((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let cropId = req.params.cropId;
			if (!idValidator([cropId], next)) {
				return;
			}
			
			let crop;
			try {
				crop = await getDocument(req, Crop, cropId, 'companionships', next);
			} catch (exception) {
				return next({ status: 404, message: 'Error' });
			}
			
			res.json(crop.companionships);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], false));
	});

// fetching a Companionship object given crop ids
// TODO: think about renaming this to make more sense
router.route('/:cropId1/companionships/:cropId2')
	.get((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let ids = [req.params.cropId1, req.params.cropId2];
			if (!idValidator(ids, next)) {
				return;
			}
			
			let crops;
			try {
				crops = await getDocuments(Crop, ids, 'companionships', next);
			} catch (exception) {
				return next({ status: 404, message: 'Error' });
			}
			
			let companionships;
			try {
				companionships = await Companionship.find().byCrop(ids[0], ids[1]).exec();
			} catch (exception) {
				return next({ status: 500, message: 'Error' });
			}
			
			if (companionships.length === 0) {
				// both crops exist, they are just neutral about each other
				res.status(204).json(); // 204 = intentionally not sending a response
			} else {
				res.status(303).location('/api/companionships/' + companionships[0]._id).send();
			}
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], false));
	});

export default router;
