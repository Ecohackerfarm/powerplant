import { Router } from 'express';
import Location from '/server/models/location';
import Helper from '/server/middleware/data-validation';
import { isAuthenticated, resetToAuthorizedUser, checkAccess } from '/server/middleware/authentication';
import { setIds, assignSingleDocument } from '/server/middleware';

const router = Router();

router.route('/')
	.post(
		isAuthenticated('Authentication required to create a location'),
		resetToAuthorizedUser,
		(req, res, next) => {
			new Location(req.body).save((err, loc) => {
				req.user.locations.push(loc);
				return loc;
			}).then(loc => {
				req.user.save((err, user) => {
					if (err) {
						next({
							status: 500,
							message: 'Unable to update user with location'
						});
					} else {
						res.status(201).json(loc);
					}
				});
			});
		}
	);

router.route('/id/:locId')
	.all(
		isAuthenticated('Authentication required to access this location'),
		setIds(req => [req.params.locId]),
		Helper.idValidator,
		// First, get the location.
		Helper.fetchLocations,
		// Now there must be exactly one location in req.locations array.
		checkAccess("locations", "You don't have access to this location"),
		assignSingleDocument("location", "locations"),
	).get(
		(req, res, next) => { res.json(req.location); }
	).put(
		(req, res, next) => {
			const location = req.location;
			Object.assign(location, req.body);
			location.save((err, newLoc) => {
				if (err) {
					console.log('Got errors');
					console.log(err);
					next({ status: 400, errors: err.errors, message: err._message });
				} else {
					res.json(newLoc);
				}
			});
		}
	).delete(
		(req, res, next) => {
			const location = req.location;
			location.remove(err => {
				if (err) {
					next({ status: 400, errors: err.errors, message: err._message });
				} else {
					res.status(200).json();
				}
			});
		}
	);

router.route('/id/:locId/beds')
	.get(
		isAuthenticated('Authentication required to view beds'),
		setIds(req => [req.params.locId]),
		Helper.idValidator,
		Helper.fetchLocations,
		checkAccess("locations", "You may not view another user's beds"),
		(req, res, next) => {
			const [location] = req.locations;
			console.log(location);
			Location.findById(location._id).populate('beds').exec((err, match) => {
				res.json(match.beds);
			});
		}
	);

export default router;
