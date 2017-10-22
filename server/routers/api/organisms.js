import express from 'express';
import Organism from '/server/models/organism.js';
import Companionship from '/server/models/companionship.js';
import { idValidator, escapeRegEx } from '/server/middleware/data-validation';
import { getDocuments, getDocument, doGet, doPut, doDelete } from '/server/middleware';
import { scheduler } from '/server';
import { ReadWriteTask } from 'async-task-schedulers';

const router = express.Router();

router.route('/')
	.get((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let organisms;
			if (typeof req.query.name !== 'undefined') {
				try {
					organisms = await Organism.find().byName(escapeRegEx(req.query.name)).exec();
				} catch (exception) {
					return next({ status: 500, message: 'Error fetching crops' });
				}
			} else {
				try {
					organisms = await Organism.find({}).exec();
				} catch (exception) {
					return next({ status: 500, message: 'Error fetching crops' });
				}
			}
			res.json(organisms);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], false));
	}).post((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let organism;
			try {
				organism = await new Organism(req.body).save();
			} catch (exception) {
				return next({ status: 400, message: 'Error saving organism' });
			}
			
			res.location('/api/organisms/' + organism._id);
			res.status(201).json(organism);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], true));
	});

router.route('/:id')
	.get((req, res, next) => {
		scheduler.push(new ReadWriteTask(doGet, [req, res, next, Organism, req.params.id], false));
	}).put((req, res, next) => {
		scheduler.push(new ReadWriteTask(doPut, [req, res, next, Organism, req.params.id], true));
	}).delete((req, res, next) => {
		scheduler.push(new ReadWriteTask(doDelete, [req, res, next, Organism, req.params.id], true));
	});

// all associated companionship objects of the given cropid
router.route('/:cropId/companionships')
	.get((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let cropId = req.params.cropId;
			if (!idValidator([cropId], next)) {
				return;
			}
			
			let companionships;
			try {
				companionships = await Companionship.find().byCrop(cropId)/*({ $or: [{ crop1: cropId }, { crop2: cropId }] })*/.exec();
			} catch (exception) {
				return next({ status: 404, message: 'Error' });
			}
			
			res.json(companionships);
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
				crops = await getDocuments(Organism, ids, '', next);
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
