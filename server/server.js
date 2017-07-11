import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost/pp_main');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true)

// set our port
var port = process.env.PORT || 8080;

import app from './app.js';

app.listen(port, function(event) {
  console.log("Server running on port " + port);
});
