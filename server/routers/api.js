import express from 'express';
import organismRouter from './api/organisms';
import companionshipRouter from './api/companionships';
import userRouter from './api/users';
import loginRouter from './api/login';
import locationRouter from './api/locations';
import bedRouter from './api/beds';

// this is where our error handling middleware for the api will go
// error responses should look different if they're in the api vs. in the front end
// so we want separate middleware for it

const router = express.Router();

// adding headers to allow cross-origin requests
// this means it's a publicly available API!
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

// assume a base url of '/api'
router.use('/organisms', organismRouter);
router.use('/companionships', companionshipRouter);
router.use('/users', userRouter);
router.use('/login', loginRouter);
router.use('/locations', locationRouter);
router.use('/beds', bedRouter);

router.get('*', (req, res, next) => {
	next({ status: 404, message: 'No such route' });
});

// our error handler middleware function
router.use((err, req, res, next) => {
	if (err) {
		res.status(err.status).json(err);
	} else {
		next();
	}
});

export default router;
