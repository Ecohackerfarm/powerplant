/**
 * Functions to initialize and start the server.
 *
 * @namespace server
 * @memberof server
 */

const express = require('express');
const cors = require('cors');
const PouchDB = require('pouchdb');
const path = require('path');
const bodyParser = require('body-parser');
const {
  HTTP_SERVER_HOST,
  HTTP_SERVER_PORT,
  ADMIN_USERNAME,
  ADMIN_PASSWORD
} = require('../secrets.js');
const { isDevelopmentMode } = require('./utils');

/**
 * Build the Express application with all middleware.
 *
 * @param {Boolean} development Development mode?
 * @return {Object} Express application
 */
function buildApp(development) {
  const app = express();

  const DIST_DIR = path.join(__dirname, '../dist');

  // Set the static files location, /dist/images will be /images for users
  app.use(express.static(DIST_DIR));

  if (development) {
    /*
     * In development mode when the source code is changed webpack
     * automatically rebuilds the bundle. In production the bundle is
     * precompiled prior to running the application.
     */
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackDevConfig = require('../webpack.config.dev');

    const compiler = webpack(webpackDevConfig);

    app.use(
      webpackDevMiddleware(compiler, {
        hot: true,
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true
      })
    );
    app.use(webpackHotMiddleware(compiler));
  }

  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true
    }),
    bodyParser.json({
      limit: '50mb',
      extended: true
    })
  );

  const expressPouchDB = require('express-pouchdb')(PouchDB);
  expressPouchDB.couchConfig.set(
    'admins',
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    (error, previousValue) => {}
  );

  // Set up our routers
  app.use('/db', cors(), expressPouchDB);

  // Thank the LORD this works correctly
  app.get('*', function(req, res) {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });

  return app;
}

/**
 * Start the server. This creates the Express app object, and initializes
 * the mongoose database connection.
 *
 * @param {Boolean} testMode
 */
function startServer(testMode) {
  const developmentMode = isDevelopmentMode() && !testMode;

  const port = process.env.PORT || HTTP_SERVER_PORT;
  const localhostArgs = ['127.0.0.1', 511];

  const serverStarted = event => {
    console.log('Server running on port ' + port);
  };

  const app = buildApp(developmentMode);

  if (!testMode) {
    if (process.env.LOCALHOST_ONLY) {
      app.listen(port, ...localhostArgs, serverStarted);
    } else {
      app.listen(port, serverStarted);
    }
  }

  return app;
}

module.exports = {
  startServer
};
