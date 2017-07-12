import mongoose from 'mongoose';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotWiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';

mongoose.connect('mongodb://localhost/pp_main');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true)

// set our port
const port = process.env.PORT || 8080;

import app from './app.js';

const compiler = webpack(webpackConfig);
app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));
app.use(webpackHotWiddleware(compiler));

app.listen(port, function(event) {
  console.log("Server running on port " + port);
});
