import { Router } from 'express';
import Location from '/server/models/location';
import Helper from '/server/middleware/data-validation';
import { isAuthenticated } from '/server/middleware/authentication';
import { doGet, doPut, doDelete } from '/server/middleware';
import { scheduler } from '/server';
import { ReadWriteTask } from 'async-task-schedulers';
import { fetchDocumentById, getDocumentById } from '/server/middleware/data-validation';

const router = Router();

router.route('/')
	.post((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			if (!isAuthenticated(req, next)) {
				return;
			}
			
			req.body.user = req.user._id;
			
			let location;
			try {
				location = await new Location(req.body).save();
			} catch (exception) {
				return next({ status: 500, message: 'Error' });
			}
			
			req.user.locations.push(location);
			try {
				await req.user.save();
			} catch (exception) {
				return next({ status: 500, message: 'Unable to update user with location' });
			}
			
			res.status(201).json(location);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], true));
	});

router.route('/:locId')
	.get((req, res, next) => {
		scheduler.push(new ReadWriteTask(doGet, [req, res, next, Location, req.params.locId], false));
	}).put((req, res, next) => {
		scheduler.push(new ReadWriteTask(doPut, [req, res, next, Location, req.params.locId], true));
	}).delete((req, res, next) => {
		scheduler.push(new ReadWriteTask(doDelete, [req, res, next, Location, req.params.locId], true));
	});

router.route('/:locId/beds')
	.get((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let location;
			if (!(location = await getDocumentById(req, Location, req.params.locId, 'beds', next))) {
				return;
			}
			
			res.json(location.beds);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], false));
	});

export default router;
