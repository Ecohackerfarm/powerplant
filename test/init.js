var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pp_main');
mongoose.Promise = global.Promise;
