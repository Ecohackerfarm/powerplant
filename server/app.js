// import express
import express from 'express';
import path from 'path';
// just updated to es2015 so now we can use import
import bodyParser from 'body-parser';
import apiRouter from './routers/api';

// build our express app
const app = express();

const DIST_DIR = path.join(__dirname, "../dist");
// set the static files location /public/img will be /img for users
app.use(express.static(DIST_DIR));

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

export default app;
