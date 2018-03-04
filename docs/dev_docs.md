Developer Documentation for powerplant

Last updated: Feb 11, 2018


Introduction
============

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

Setup
=====

To start, you need to set up the development environment.

1. [Install Node](https://nodejs.org/en/download/current/). Version 9.x.
2. [Install MongoDB](https://www.mongodb.com/download-center#community) and
   run `mongod`. Version 3.4.
3. Clone the [git repository](https://github.com/Ecohackerfarm/powerplant.git)
4. Run `npm install` to get all packages installed
5. Generate a private key in secrets.js (see secrets.example.js)
6. Run `npm start` to start the server
7. Run `npm run migrate` to migrate crop data from Firebase database
8. At this point everything should be set up. Run `npm test` to make sure
   everything is working.
9. Done!

It is also possible to run MongoDB in Docker:

1. [Install Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#install-using-the-repository)
2. Install the [Mongo Docker image](https://hub.docker.com/_/mongo/) by
   running `docker pull mongo`
3. Start the Docker image by running `npm run mongo`

The project may not run properly after reboot because it fails to
connect to the database. Running `docker restart pp_main` fixes the
issue.

Common Mistakes
===============

Server doesn't start:
---------------------

```
/Users/adinajohnson/repos/powerplant/server/middleware.js:88
async function getAuthenticatedUser(req, next) {
      ^^^^^^^^
SyntaxError: Unexpected token function
  ...
[nodemon] app crashed - waiting for file changes before starting...
```

This looks like you didn't install the right version of NodeJS (power plant needs >9.4.0). So install the right Version: https://nodejs.org/en/download/current/ .

Server doesn't start after NodeJS update:
-----------------------------------------

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

Architecture
============

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

### UI

UI is built with React. The code is written in a subset of ES6 that is
natively supported by modern versions of most web browsers. Babel is used to
translate JSX to JS, and that is the only thing that gets translated. Webpack
is used to bundle all UI modules together, and it is using the Node module
format with `require`.

#### Redux store

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

### CLI

The CLI is used for migrating crop data and for administration tasks. To keep
everything properly synchronized the database is never modified directly, but
always through the server even for administration tasks.

Eventually the CLI and the UI should be using a common client component.

### Server

The server is a Node application. The code is written in a subset of ES6 that
is natively supported by Node/V8. There are three main components in the
server: Express HTTP server (`server/server.js`), middleware
(`server/middleware.js`) and Processor (`server/processor.js`).

Middleware consists of functions that handle HTTP requests and produce
responses to them. These functions are called by the Express HTTP server, and
they use the services of the Processor object to access data and to perform
calculations.

Processor is the only component that has access to the database. It uses
mongoose to connect to a MongoDB database. Processor consists of async
methods that operate on the database data. Sometimes these operations want
to access the same part of data at the same time. To solve this problem,
Processor places each operation to a queue and lets only compatible
operations to run in parallel.

#### Database structure

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

Coding style
============

- Use a subset of ES6 that is natively supported by both Node and web
  browsers.
- Define React components always with `class` instead of functions.

Developer documentation
=======================

Developer documentation consists of this overview of the structure of the
project, and API documentation that is generated with JSDoc.

The documentation is also available
[online](https://ecohackerfarm.github.io/powerplant), and it should be
regenerated at least when this overview is updated.

Documentation should be kept synchronized with code. If you find something
that is missing in this overview, or a function that lacks a jsdoc comment,
fix it.

### JSDoc conventions

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

Tests
=====

You can run tests with the `npm test` command. Note that in order to
test the server code correctly, the tests must be able to connect to the
mongo docker image. This connection happens in `/test/server/init.js`.
You also need to have migrated the data to the mongodb database with
`npm run migrate`. If you ever get a few odd failed tests ("cannot get
property '\_id'" or something like that), it's possible you forgot to
migrate the data.

Tests are stored in the `/test` folder. The structure of this folder
should mirror the root file structure. This makes it easy to find the
test module for any module. Tests should be written for every component
that contains business logic or helper functions, as well as every API
route. No tests need to be written for external library functions (like
Mongoose `Models`). However, if you write an extensions to an external
function, like a query function for a Mongoose `Model`, that should be
tested.

Whenever possible, use unit testing to test a single component separate
from the rest of the codebase.

If isolation is not possibe, integration tests are ok too. This is
necessary for API tests, and possibly also for database functions.

All tests are dispatched with Mocha and use the `expect` function from
the assertion library Chai. API tests use supertest to create requests.

### Mocha

https://mochajs.org/

Mocha is the test-running framework which is used to organize the tests.
It is used by the `npm test` command as the environment in which the
tests are run, so it does not need to be imported in any of the test
classes.

We use the BDD (behaviour-drive-development) syntax, so the main
functions used to organize tests are `describe` and `it`. `describe` is
used to separate modules and functionalities within modules, and `it` is
used to describe a specific behaviour. Generally, tests for a module are
organized with two levels of `describe`, the first being the name of the
module, and the second being for a specific function or functionality.
Test code then goes within an `it` function in the second.

For example:

```
    describe('data-validation', () => { // module name
        describe('#idValidation()', () => { // function name
            it('should validate a correct id', () = > {
                // test code goes here
            });
        });
        describe('#getCompanionshipScores()', () => { // other function name
        it('should return correct scores', () => {
    // test code goes here
    });
        });
    });
```

or

```
    describe('authReducer', () => { // module name
        describe('SET_CURRENT_USER', () => { //not a function, but a specific functionality
            it("should set the current user", () => {
                // test code goes here
            });
        });
    });
```

Mocha tests run synchronously, but it does support asynchronous test
code through the use of promises. To test asynchronous code, simply have
the `it` function return a promise. The next test will not execute until
the promise is resolved.

### Chai

http://chaijs.com/, [cheat
sheet](https://gist.github.com/yoavniran/1e3b0162e1545055429e)

Tests use the `expect` function of Chai to assert that all things are as
they should be. Each `expect` call is an opportunity for a test to fail.
If all `expect` calls in an `it()` function pass, the test passes. Chai
supports function chaining to create self-documenting tests. See the
cheat sheet above for an overview of the functions.

### Supertest

https://www.npmjs.com/package/supertest

Supertest allows testing of network request-based functionality (REST
API routes, in our case). See the tests in `/test/server/routes/api/`
for examples. A supertest request return a promise, so it can be
returned in an `it` function and the test will wait until the request
completes to continue.
