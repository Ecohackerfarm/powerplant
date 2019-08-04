Developer Documentation for powerplant

Last updated: August 4th, 2019


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

1. Install [Node](https://nodejs.org/en/download/).
2. Run `git clone https://github.com/Ecohackerfarm/powerplant.git` to clone the git repository.
3. Run `npm install` to get all packages installed.
4. Generate a private key in secrets.js (easiest is to run `cp secrets.example.js secrets.js`).
5. Run `npm start` to start the server.
6. Run `npm run migrate` to migrate the database to PouchDB.
7. Point your browser to `http://localhost:8080/`.
8. Done!

## Common Mistakes

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

powerplant is a web app that is using Node.js on the server side and React
for the web UI. It uses PouchDB to synchronize data between the server and
clients. There is also a simple CLI that is used for testing and
maintenance.

## UI

UI is built with React using the `react-bootstrap` library, but there have
been plans to move using a more complete UI component library, to avoid the
need to create basic components like list views from scratch.

Code is written in a subset of ES6 that is natively supported by modern
browsers. Babel is currently only used for translating JSX to JS.

Webpack is used to bundle all UI modules together.

### Redux store

Redux is the be-all-end-all of the state of the application (with very
few exceptions, like form state). Every bit of user data is stored in
redux.

In addition, the `redux-persist` module saves the redux store in local
storage and reloads ("rehydrates") it every time the user visits the
website. This is what allows users to save data without registering, and
speeds up the process of displaying registered users' data. It also
means that the website can be used offline if the page is loaded first.

# Crop database

We use a large crop database that has been scraped from practicalplants.org.
The main purpose of having this data in the repository is to be able to
quickly set up the application for real use.

The crop database is also used for testing the functionality of the
application with real data.

# Developer documentation

Developer documentation consists of this overview of the structure of the
project, and API documentation that is generated with JSDoc.

The documentation is also available
[online](https://ecohackerfarm.github.io/powerplant).

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

Tests are in the `/test` directory. The directory structure should mirror
the root directory structure as close as possible.

[Mocha](https://mochajs.org/) is used as the test framework.

[Chai](https://www.chaijs.com/) is used as the assertion library. You may
choose either the expect or the assert style. 

## Using `npm test` to study/play with a specific piece of code

Sometimes when studying code it is easiest to write a local test to expose
its behavior. One way to do this is to use the [exclusivity feature](https://mochajs.org/#exclusive-tests)
of Mocha to specify only the written test to be run with `npm test`.
