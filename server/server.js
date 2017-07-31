import mongoose from 'mongoose';
import { buildApp } from './app';

// mongoose.connect('mongodb://localhost/pp_main');
mongoose.connect('mongodb://192.168.99.100:27017/pp_main');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true)

// set our port
const port = process.env.PORT || 8080;

const app = buildApp(true);

app.listen(port, function(event) {
	console.log('Server running on port ' + port);
});
