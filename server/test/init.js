var mongoose = require('mongoose');


//TODO: Set up a test database! (pp_test)
mongoose.connect('mongodb://localhost/pp_main');
mongoose.Promise = global.Promise;
