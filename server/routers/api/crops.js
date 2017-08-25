import express from 'express';
import Crop from '/server/models/crop.js';
import Companionship from '/server/models/companionship.js';
import Helper from '/server/middleware/data-validation';
import { setIds, assignSingleDocument, renderResult } from '/server/middleware';

const router = express.Router();

// All routes have the base route /crops

router.route('/')
	.get(
		(req, res, next) => {
			// validate req
			if (typeof req.query.name !== 'undefined') {
				const cropName = Helper.escapeRegEx(req.query.name);
				Crop.find().byName(cropName).exec((err, crops) => {
					if (err) {
						next({ status: 500, message: 'Error fetching crops' });
					} else {
						res.json(crops);
					}
				});
			} else {
				// if no search query, go to next
				next();
			}
		}
	).get(
		(req, res, next) => {
			Crop.find({}, (err, crops) => {
				if (err) {
					next({ status: 500, message: 'Error fetching crops', err: err });
				} else {
					res.json(crops);
				}
			});
		}
	).post(
		(req, res, next) => {
			new Crop(req.body).save((err, crop) => {
				if (err) {
					next({ status: 400, message: err.message });
				} else {
					res.location('/api/crops/' + crop._id);
					res.status(201).json(crop);
				}
			});
		}
	);

router.route('/:cropId')
	.all(
		// first validate the id by extracting and using helper function
		setIds(req => [req.params.cropId]),
		Helper.idValidator,
		Helper.fetchCrops,
		assignSingleDocument('crop', 'crops')
	).get(
		renderResult('crop')
	).put(
		(req, res, next) => {
			// since object ids are generated internally, this can never be used to create a new crop
			// thus the user is trying to update a crop
			Crop.findByIdAndUpdate(req.params.cropId, req.body, { new: true }, (err, crop) => {
				if (err) {
					// we already know the crop exists, so it must be bad data
					next({ status: 400, message: err.message });
				} else {
					res.json(crop);
				}
			});
		}
	).delete(
		(req, res, next) => {
			Companionship.find().byCrop(req.params.cropId).remove().exec(err => {
				if (err) {
					next({ status: 500, message: err.message });
				} else {
					Crop.findByIdAndRemove(req.params.cropId, err => {
						if (err) {
							next({ status: 500, message: err.message });
						} else {
							res.status(204).json();
						}
					});
				}
			});
		}
	);

// all associated companionship objects of the given cropid
router.route('/:cropId/companionships')
	.all(
		setIds(req => [req.params.cropId]),
		Helper.idValidator,
		Helper.fetchCropsWithCompanionships
	).get(
		(req, res, next) => {
			res.json(req.crops[0].companionships);
		}
	);

// fetching a Companionship object given crop ids
// TODO: think about renaming this to make more sense
router.route('/:cropId1/companionships/:cropId2')
	.all(
		setIds(req => [req.params.cropId1, req.params.cropId2]),
		Helper.idValidator,
		Helper.checkCrops
	).get(
		(req, res, next) => {
			Companionship.find().byCrop(req.ids[0], req.ids[1]).exec((err, matches) => {
				if (err) {
					next({ status: 500, message: err.message });
				} else if (matches.length === 0) {
					// both crops exist, they are just neutral about each other
					res.status(204).json(); // 204 = intentionally not sending a response
				} else {
					res
						.status(303)
						.location('/api/companionships/' + matches[0]._id)
						.send(); // see other
					// in a browser, this will result in a redirect
				}
			});
		}
	);

export default router;
