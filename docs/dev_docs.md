Developer Documentation for powerplant

Last updated: December 2nd, 2018


# Introduction

powerplant is a full-stack JS web app utilizing several external services and
many interlocking components. The aim of this document is to help you, as a
developer, to get familiar with all parts of the software. It should act as a
roadmap, showing you where each functionality of the software lies, and where
each new functionality belongs.

Helpful external documentation:

- [Thinking in React](https://reactjs.org/docs/thinking-in-react.html)
- [RESTful Web Services](http://restfulwebapis.org/RESTful_Web_Services.pdf)
- [Redux principles](https://redux.js.org/docs/introduction/ThreePrinciples.html)
- [ECMAScript 6 overview](http://es6-features.org/)
- [JSDoc documentation](http://usejsdoc.org/)
- [webpack concepts](https://webpack.js.org/concepts/)
- [Mocha test framework](https://mochajs.org/)
- [Chai assertion styles](https://www.chaijs.com/guide/styles/)
- [Chai cheat sheet for the expect style](https://gist.github.com/yoavniran/1e3b0162e1545055429e)

# Setup

To start, you need to set up the development environment.

1. [Install Node](https://nodejs.org/en/download/current/). Version 9.x.
2. [Install MongoDB](https://www.mongodb.com/download-center#community). Version 4.x.
3. Start MongoDB with `mongod --replSet rs`.
4. Connect a mongo shell to the mongod instance.
5. Use `rs.initiate()` to initiate the new replica set.
6. Clone the [git repository](https://github.com/Ecohackerfarm/powerplant.git)
7. Run `npm install` to get all packages installed
8. Generate a private key in secrets.js (see secrets.example.js)
9. Run `npm start` to start the server
10. Run `npm run migrate` to migrate crop data from Firebase database
11. At this point everything should be set up. Run `npm test` to make sure
   everything is working.
12. Done!

It is also possible to run MongoDB in Docker:

1. [Install Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#install-using-the-repository)
2. Install the [Mongo Docker image](https://hub.docker.com/_/mongo/) by
   running `docker pull mongo`
3. Start the Docker image by running `npm run mongo`

The project may not run properly after reboot because it fails to
connect to the database. Running `docker restart pp_main` fixes the
issue.

## Common Mistakes

### Server doesn't start:

```
/Users/adinajohnson/repos/powerplant/server/middleware.js:88
async function getAuthenticatedUser(req, next) {
      ^^^^^^^^
SyntaxError: Unexpected token function
  ...
[nodemon] app crashed - waiting for file changes before starting...
```

This looks like you didn't install the right version of NodeJS (power plant needs >9.4.0). So install the right Version: https://nodejs.org/en/download/current/ .

### Server doesn't start after NodeJS update:

```
Error: The module '/home/justus/workspace/powerplant/node_modules/bcrypt/lib/binding/bcrypt_lib.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 48. This version of Node.js requires
NODE_MODULE_VERSION 59. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

This means you updated NodeJS and the easiest way to solve this is to run.
```bash
rm -R node_modules && npm install
```

# Architecture

Users use web browser to operate on a powerplant system. The system is
composed of three main components: UI, client and server. UI is the front
end, while client and server are the back end. An important aspect of the
system design is that most functionality may be used offline. Therefore most
calculations are done on the client side while the server is mostly used for
persisting data and for synchronization.

UI is running in the browser and it is using the client component to perform
calculations and to persist data by communicating with the server. Our plan
is to eventually build a generic client component that is used by the web UI,
the CLI, and by third-party software.

## UI

UI is built with React. The code is written in a subset of ES6 that is
natively supported by modern versions of most web browsers. Babel is used to
translate JSX to JS, and that is the only thing that gets translated. Webpack
is used to bundle all UI modules together, and it is using the Node module
format with `require`.

### Redux store

Redux is the be-all-end-all of the state of the application (with very
few exceptions, like form state). Every bit of user data is stored in
redux. The store has the following architecture:

```
    {
      title: String (default: "powerplant"), // the title that will be displayed in the window
      auth: {
        isAuthenticated: Bool (default: false),
        currentUser: User (default: null),
      },
      currLocation: Location (default: null),
      locations: [Location] (default: []),
      beds: [Bed] (default: []),
      crops: [Crop] (default: []),
      cropInfos: [CropInformation] (default: []),
      cropRelationships: [CropRelationship] (default: [])
    }
```

In addition, the `redux-persist` module saves the redux store in local
storage and reloads ("rehydrates") it every time the user visits the
website. This is what allows users to save data without registering, and
speeds up the process of displaying registered users' data. It also
means that the website can be used offline if the page is loaded first.

## CLI

The CLI is used for migrating crop data and for administration tasks. To keep
everything properly synchronized the database is never modified directly, but
always through the server even for administration tasks.

The CLI and the UI are using common client functions (`shared/api-client.js`)
that are based on the Axios HTTP client.

## Server

The server is a Node application. The code is written in a subset of ES6 that
is natively supported by Node/V8. There are three main components in the
server: Express HTTP server (`server/server.js`), middleware
(`server/middleware.js`) and processor functions (`server/processor.js`).

Middleware consists of functions that handle HTTP requests and produce
responses to them. These functions are called by the Express HTTP server, and
they use the operations of the processor file to access data and to perform
calculations.

All operations that access the database are wrapped inside MongoDB
transactions to ensure that all reads inside a transaction are done on a
single snapshot and that writes across multiple operations don't interfere
with each other.

### Database structure

Crop schema

```
binomialName:String
commonName:String
```

---

CropRelationship schema

```
crop0:ObjectId(Crop)
crop1:ObjectId(Crop)
compatibility:Number
```

# Coding style

- Use a subset of ES6 that is natively supported by both Node and web
  browsers.
- Define React components always with `class` instead of functions.

# Developer documentation

Developer documentation consists of this overview of the structure of the
project, and API documentation that is generated with JSDoc.

The documentation is also available
[online](https://ecohackerfarm.github.io/powerplant), and it should be
regenerated at least when this overview is updated.

Documentation should be kept synchronized with code. If you find something
that is missing in this overview, or a function that lacks a jsdoc comment,
fix it.

## JSDoc conventions

Every directory and every file is marked with `@namespace`. For directories,
this is done in file `index.js`. At the top of each file there should be a
jsdoc comment with the following structure. Take for example the file
`server/models/crop.js`:

```
/**
 * Mongoose model for crops.
 *
 * @namespace crop
 * @memberof server.models
 */
```

---

Every function should have a jsdoc comment that documents the parameters
(`@param`) and the return value (`@return`). For example:

```
/**
 * Try to login with the given credentials.
 * 
 * @param {Object} credentials Username and password
 * @return {Object} Authorization token
 */
async login(credentials) {
```

---

Every class should have a jsdoc comment like this:

```
/**
 * Represents the main content area of the application, in contrast to
 * Header which is the main navigation component.
 * 
 * @extends Component
 */
class Main extends React.Component {
```

# Tests

You can run the tests with the `npm test` command. Note that MongoDB must be
running and the data must be migrated with `npm run migrate` for the server
integration tests to pass.

Tests are in the `/test` directory. The directory structure should mirror
the root directory structure as close as possible.

[Mocha](https://mochajs.org/) is used as the test framework.

[Chai](https://www.chaijs.com/) is used as the assertion library. You may
choose either the expect or the assert style. 

[SuperTest](https://www.npmjs.com/package/supertest) is used for the server
integration tests.

## Using `npm test` to study/play with a specific piece of code

Sometimes when studying code it is easiest to write a local test to expose
its behavior. One way to do this is to use the [exclusivity feature](https://mochajs.org/#exclusive-tests)
of Mocha to specify only the written test to be run with `npm test`.
