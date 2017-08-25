import { Router } from 'express';
import Helper from '/server/middleware/data-validation';
import { isAuthenticated, checkAccess, resetToAuthorizedUser } from '/server/middleware/authentication';
import { setIds, assignSingleDocument, updateDocument, deleteDocument, renderResult } from '/server/middleware';
import Bed from '/server/models/bed';

const router = Router();

router.route('/').post(
	isAuthenticated('Authentication required to create a bed'),
	setIds(req => [req.body.location]),
	Helper.idValidator,
	Helper.fetchLocations,
	checkAccess('locations', "You don't have access to this location"),
	resetToAuthorizedUser,
	(req, res, next) => {
		const [location] = req.locations;
		new Bed(req.body).save((err, bed) => {
			location.beds.push(bed);
			return bed;
		}).then(bed => {
			location.save((err, location) => {
				if (err) {
					next({ status: 500, message: 'Unable to update location with bed' });
				} else {
					res.status(201).json(bed);
				}
			});
		});
	}
);

router.route('/id/:bedId')
	.all(
		isAuthenticated('Authentication required to access this bed'),
		setIds(req => [req.params.bedId]),
		Helper.idValidator,
		// First, get the bed.
		Helper.fetchBeds,
		// Now there must be exactly one bed in req.beds array.
		checkAccess('beds', "You don't have access to this bed"),
		assignSingleDocument('bed', 'beds'),
	).get(
		renderResult('bed')
	).put(
		updateDocument('bed')
	).delete(
		deleteDocument('bed')
	);

export default router;
