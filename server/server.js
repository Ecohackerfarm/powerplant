import mongoose from 'mongoose';
import { buildApp } from './app';
import { databaseUrl } from '/server/app';

mongoose.connect(databaseUrl);
mongoose.Promise = global.Promise;
// mongoose.set('debug', true)

// set our port
const port = process.env.PORT || 8080;

const app = buildApp(true);

app.listen(
	port,
	'127.0.0.1',
	511,
	function(event) {
		console.log('Server running on port ' + port);
	}
);
