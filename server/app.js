/**
 * Holds the instance of the express app
 * @namespace app
 * @memberof server
 */

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import apiRouter from './api';
import webpack from 'webpack';
import webpackConfig from '../webpack.config';
import { Processor } from './processor';

//WebPack Development
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevConfig from '../webpack.config.dev';


export let processor = new Processor();

/**
 * the express app
 * @type {Object}
 */
const app = express();

/**
 * Sets up the express application with all middleware
 * @param  {Boolean} development whether or not development enviroment for e.g. webpack is enabled,
 * @return {Object} the express app
 */
export const buildApp = (useWebpack,development = false) => {
	const DIST_DIR = path.join(__dirname, '../dist');
	// set the static files location /dist/images will be /images for users
	app.use(express.static(DIST_DIR));

	if (useWebpack) {
		if (development){
			const compiler = webpack(webpackDevConfig);
			//Development only
			app.use(
				webpackDevMiddleware(compiler, {
					hot: true,
					publicPath: webpackDevConfig.output.publicPath,
					noInfo: true
				})
			);
			//Development only
			app.use(webpackHotMiddleware(compiler));
		} else {
			webpack(webpackConfig);
		}
	}

	app.use(
		bodyParser.urlencoded({
			extended: true
		}),
		bodyParser.json()
	);

	// set up our routers
	app.use('/api', apiRouter);

	// thank the LORD this works correctly
	app.get('*', function(req, res) {
		res.sendFile(path.join(DIST_DIR, 'index.html'));
	});

	return app;
};

export default app;
