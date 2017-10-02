import { Router } from 'express';
import Helper from '/server/middleware/data-validation';
import { doGet, doPut, doDelete } from '/server/middleware';
import Bed from '/server/models/bed';
import Location from '/server/models/location';
import { scheduler } from '/server';
import { ReadWriteTask } from 'async-task-schedulers';
import { getDocumentById } from '/server/middleware/data-validation';

const router = Router();

router.route('/').post((req, res, next) => {
	const asyncFunction = async function(req, res, next) {
		let location;
		if (!(location = await getDocumentById(req, Location, req.body.location, 'beds', next))) {
			return;
		}
		
		req.body.user = req.user._id;
		
		let bed;
		try {
			bed = await new Bed(req.body).save();
		} catch (exception) {
			return next({ status: 500, message: 'Unable to save bed' });
		}
		
		location.beds.push(bed);
		try {
			await location.save();
		} catch (exception) {
			return next({ status: 500, message: 'Unable to update location with bed' });
		}
		
		res.status(201).json(bed);
	};
	scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], true));
});

router.route('/:bedId')
	.get((req, res, next) => {
		scheduler.push(new ReadWriteTask(doGet, [req, res, next, Bed, req.params.bedId], false));
	}).put((req, res, next) => {
		scheduler.push(new ReadWriteTask(doPut, [req, res, next, Bed, req.params.bedId], true));
	}).delete((req, res, next) => {
		scheduler.push(new ReadWriteTask(doDelete, [req, res, next, Bed, req.params.bedId], true));
	});

export default router;
