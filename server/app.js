// import express
import express from 'express';
import path from 'path';
// just updated to es2015 so now we can use import
import bodyParser from 'body-parser';
import apiRouter from './routers/api';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotWiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';

const app = express();

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

// by default, we build with webpack
// sometimes, don't want to (like if we're only testing the server)
export default app;
