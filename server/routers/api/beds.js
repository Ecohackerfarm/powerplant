import { Router } from 'express';
import { getAuthorizedDocument, doAuthorizedGet, doAuthorizedPut, doAuthorizedDelete } from '/server/middleware';
import Bed from '/server/models/bed';
import Location from '/server/models/location';
import { scheduler } from '/server';
import { ReadWriteTask } from 'async-task-schedulers';

const router = Router();

router.route('/').post((req, res, next) => {
	const asyncFunction = async function(req, res, next) {
		let location = await getAuthorizedDocument(req, Location, req.body.location, 'beds', next);
		if (!location) {
			return;
		}
		
		req.body.user = location.user;
		
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
		scheduler.push(new ReadWriteTask(doAuthorizedGet, [req, res, next, Bed, req.params.bedId], false));
	}).put((req, res, next) => {
		scheduler.push(new ReadWriteTask(doAuthorizedPut, [req, res, next, Bed, req.params.bedId], true));
	}).delete((req, res, next) => {
		scheduler.push(new ReadWriteTask(doAuthorizedDelete, [req, res, next, Bed, req.params.bedId], true));
	});

export default router;
