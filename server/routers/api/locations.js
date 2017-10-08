import { Router } from 'express';
import Location from '/server/models/location';
import { getAuthenticatedUser } from '/server/middleware/authentication';
import { getAuthorizedDocument, doAuthorizedGet, doAuthorizedPut, doAuthorizedDelete } from '/server/middleware';
import { scheduler } from '/server';
import { ReadWriteTask } from 'async-task-schedulers';

const router = Router();

router.route('/')
	.post((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			const user = await getAuthenticatedUser(req, next);
			if (!user) {
				return;
			}
			
			req.body.user = user._id;
			
			let location;
			try {
				location = await new Location(req.body).save();
			} catch (exception) {
				return next({ status: 500, message: 'Error' });
			}
			
			user.locations.push(location);
			try {
				await user.save();
			} catch (exception) {
				return next({ status: 500, message: 'Unable to update user with location' });
			}
			
			res.status(201).json(location);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], true));
	});

router.route('/:locId')
	.get((req, res, next) => {
		scheduler.push(new ReadWriteTask(doAuthorizedGet, [req, res, next, Location, req.params.locId], false));
	}).put((req, res, next) => {
		scheduler.push(new ReadWriteTask(doAuthorizedPut, [req, res, next, Location, req.params.locId], true));
	}).delete((req, res, next) => {
		scheduler.push(new ReadWriteTask(doAuthorizedDelete, [req, res, next, Location, req.params.locId], true));
	});

router.route('/:locId/beds')
	.get((req, res, next) => {
		const asyncFunction = async function(req, res, next) {
			let location = await getAuthorizedDocument(req, Location, req.params.locId, 'beds', next);
			if (!location) {
				return;
			}
			
			res.json(location.beds);
		};
		scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], false));
	});

export default router;
