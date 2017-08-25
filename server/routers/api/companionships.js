import express from 'express';
import Companionship from '/server/models/companionship';
import Crop from '/server/models/crop';
import Helper from '/server/middleware/data-validation';
import { setIds, assignSingleDocument, updateDocument, deleteDocument, renderResult } from '/server/middleware';

const router = express.Router();

// All routes have the base route: /companionships

router.route('/')
	.get(
		(req, res) => {
			// get all combinations - this is REALLY slow (over 2s) but it's also a huge request
			// could consider pagination - return 50 results and a link to the next 50
			Companionship.find({}, (err, result) => { res.json(result); });
		}
	).post(
		setIds(req => [req.body.crop1, req.body.crop2]),
		Helper.idValidator,
		Helper.checkCrops,
		(req, res, next) => {
			// This should be the ONLY route to add a new combination
			// first need to check if it exists already
			Companionship.find().byCrop(req.ids[0], req.ids[1]).exec((err, matches) => {
				if (err) {
					next({ status: 500, message: err.message });
				} else {
					if (matches.length > 0) {
						res
							.status(303)
							.location('/api/companionships/' + matches[0])
							.json();
					} else {
						new Companionship(req.body).save((err, combo) => {
							if (err) {
								next({ status: 400, message: err.message });
							} else {
								Crop.findByIdAndUpdate(combo.crop1, {
									$push: { companionships: combo._id }
								});
								if (!combo.crop1.equals(combo.crop2)) {
									Crop.findByIdAndUpdate(combo.crop2, {
										$push: { companionships: combo._id }
									});
								}
								res.location('/api/companionships/' + combo._id);
								res.status(201).json(combo);
							}
						});
					}
				}
			});
		}
	);

router.route('/scores')
	.all(
		setIds(req => ((req.query.id || '').split(','))),
		Helper.idValidator,
		Helper.fetchCropsWithCompanionships
	).get(
		(req, res, next) => {
			const crops = req.crops;
			const companionships = crops.map(crop => crop.companionships);
			const ids = req.ids;
			const scores = Helper.getCompanionshipScores(companionships, ids);
			res.json(scores);
		}
	);

router.route('/:id')
	.all(
		setIds(req => [req.params.id]),
		Helper.idValidator, // validate id (sends 400 if malformed id)
		Helper.fetchCompanionships, // fetch item (sends 404 if nonexistent)
		assignSingleDocument('companionship', 'companionships')
	).get(
		renderResult('companionship')
	).put(
		(req, res, next) => {
			// TODO: validate crop1 and crop2
			const c1Exists = req.body.hasOwnProperty('crop1');
			const c2Exists = req.body.hasOwnProperty('crop2');
			req.ids = [];
			if (c1Exists) {
				req.ids.push(req.body.crop1);
			}
			if (c2Exists) {
				req.ids.push(req.body.crop2);
			}
			if (!c1Exists && !c2Exists) {
				delete req.ids;
			}
			next();
		},
		Helper.idValidator,
		Helper.checkCrops,
		updateDocument('companionship')
	).delete(
		deleteDocument('companionship')
	);

export default router;
