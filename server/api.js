import express from 'express';
import {
	documentGet,
	documentPut,
	documentDelete,
	documentPost,
	getCropGroups,
	getCompatibleCrops,
	getAllCropRelationships,
	getCropsByName,
	getLocations,
	getCropRelationshipScores,
	getCropRelationship,
	getCropRelationshipsByCrop,
	login
} from '/server/middleware';
import Crop from '/server/models/crop';
import CropRelationship from '/server/models/crop-relationship';
import Location from '/server/models/location';
import User from '/server/models/user';

/**
 * Create a new router for a document API node.
 *
 * @return {Router}
 */
function newDocumentRouter(model) {
	const router = express.Router();

	router.route('/').post((req, res, next) => {
		documentPost(req, res, next, model);
	});
	router.route('/:id').get((req, res, next) => {
		documentGet(req, res, next, model);
	});
	if (model != User) {
		router
			.route('/:id')
			.put((req, res, next) => {
				documentPut(req, res, next, model);
			})
			.delete((req, res, next) => {
				documentDelete(req, res, next, model);
			});
	}

	return router;
}

const router = express.Router();

/*
 * Adding headers to allow cross-origin requests. This means it's a publicly
 * available API!
 */
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

/*
 * API document points that allow the low-level editing of database documents.
 */
router.use('/crops', newDocumentRouter(Crop));
router.use('/crop-relationships', newDocumentRouter(CropRelationship));
router.use('/users', newDocumentRouter(User));
router.use('/locations', newDocumentRouter(Location));

/*
 * API function points for more complex calculations.
 */
router.post('/login', login);
router.get('/get-crops-by-name', getCropsByName);
router.post('/get-crop-groups', getCropGroups);
router.post('/get-compatible-crops', getCompatibleCrops);
router.get('/get-all-crop-relationships', getAllCropRelationships);
router.get('/get-locations', getLocations);
router.get('/get-crop-relationship-scores', getCropRelationshipScores);
router.get(
	'/get-crop-relationships-by-crop/:cropId',
	getCropRelationshipsByCrop
);
router.get('/get-crop-relationship/:crop0Id/:crop1Id', getCropRelationship);

router.get('*', (req, res, next) => {
	next({ status: 404, message: 'No such route' });
});

/*
 * Error handling middleware. Error responses should look different if they are
 * in the API vs. in the front end so we want separate middleware for it.
 */
router.use((err, req, res, next) => {
	if (err) {
		res.status(err.status).json(err);
	} else {
		next();
	}
});

export default router;
