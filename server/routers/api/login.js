import { Router } from 'express';
import User from '/server/models/user';
import validate from '/shared/validation/loginValidation';
import jwt from 'jsonwebtoken';
import jwtSecret from '/jwt-secret';
import { scheduler } from '/server';
import { ReadWriteTask } from 'async-task-schedulers';

// TODO: load jwtSecret from /jwt-secret.pem

const router = Router();

router.route('/').post((req, res, next) => {
	const asyncFunction = async function(req, res, next) {
		const login = req.body;
	
		// first, make sure credentials pass validation
		const { errors, isValid } = validate(login);
		if (!isValid) {
			return next({ status: 401, message: 'Invalid login credentials', errors });
		}
		
		// next make sure the user exists
		let user;
		try {
			user = await User.find().byUsername(login.username).select(['password', 'email', 'username']).exec();
		} catch (exception) {
			return next({ status: 401, message: 'Unable to log in', errors: { username: 'Username not found' } });
		}
		
		// finally, check if password is correct
		try {
			if (await user.checkPassword(login.password)) {
				const token = jwt.sign({
						id: user._id,
						username: user.username,
						email: user.email
					}, jwtSecret);
				res.json({ token });
			} else {
				next({ status: 401, message: 'Unable to log in', errors: { password: 'Incorrect password' } });
			}
		} catch (exception) {
			next({ status: 500, message: 'Error logging in' });
		}
	};
	scheduler.push(new ReadWriteTask(asyncFunction, [req, res, next], false));
});

export default router;
