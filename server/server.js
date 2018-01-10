import mongoose from 'mongoose';
import { buildApp } from './app';
import { databaseUrl } from '/server/app';

mongoose.connect(databaseUrl);
mongoose.Promise = global.Promise;
// mongoose.set('debug', true)

// set our port
const port = process.env.PORT || 8080;
const localhostArgs = ['127.0.0.1',511];

const serverStarted = (event) => {
	console.log('Server running on port ' + port);
}

const app = buildApp(true);
if (process.env.LISTEN_TO_LOCALHOST_ONLY) {
	app.listen(
		port,
		...localhostArgs,
		serverStarted
	);
} else {
	app.listen(
		port,
		serverStarted
	);
}

