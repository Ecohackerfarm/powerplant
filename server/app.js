/**
 * Holds the instance of the express app
 * @namespace app
 * @memberof server
 */

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import apiRouter from './routers/api';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotWiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';

/**
 * the express app
 * @type {Object}
 */
const app = express();

/**
 * Sets up the express application with all middleware
 * @param  {Boolean} useWebpack whether or not webpack should be used to bundle the client files. Generally should only be false when testing, and server-client communication is not necessary
 * @return {Object} the express app
 */
export const buildApp = (useWebpack) => {
  const DIST_DIR = path.join(__dirname, "../dist");
  // set the static files location /public/img will be /img for users
  app.use(express.static(DIST_DIR));

  if (useWebpack) {
    const compiler = webpack(webpackConfig);
    app.use(webpackMiddleware(compiler, {
      hot: true,
      publicPath: webpackConfig.output.publicPath,
      noInfo: true
    }));
    app.use(webpackHotWiddleware(compiler));
  }

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

  return app;
}

export default app;
