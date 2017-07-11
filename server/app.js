// import express
import express from 'express';
import path from 'path';
// just updated to es2015 so now we can use import
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotWiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';
import bodyParser from 'body-parser';
import apiRouter from './routers/api';

// build our express app
var app = express();

var DIST_DIR = path.join(__dirname, "../dist");
// set the static files location /public/img will be /img for users
app.use(express.static(DIST_DIR));

var compiler = webpack(webpackConfig);
app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));
app.use(webpackHotWiddleware(compiler));
app.use(bodyParser.urlencoded({
    extended: true
  }),
  bodyParser.json());

// set up our routers
app.use('/api', apiRouter);
// thank the LORD this works correctly
app.get("*", function(req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
})

module.exports = app;
