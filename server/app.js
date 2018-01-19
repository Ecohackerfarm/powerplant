/**
 * Holds the instance of the express app
 * 
 * @namespace app
 * @memberof server
 */

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import apiRouter from './api';
import { Processor } from './processor';

export let processor = new Processor();

/**
 * The express app
 * 
 * @type {Object}
 */
const app = express();

/**
 * Set up the Express application with all middleware.
 * 
 * @param {Boolean} development Development mode?
 * @return {Object} Express application
 */
export const buildApp = (development = false) => {
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
		const webpackDevConfig = require ('../webpack.config.dev');

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
			extended: true
		}),
		bodyParser.json()
	);

	// Set up our routers
	app.use('/api', apiRouter);

	// Thank the LORD this works correctly
	app.get('*', function(req, res) {
		res.sendFile(path.join(DIST_DIR, 'index.html'));
	});

	return app;
};

export default app;
