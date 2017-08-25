Developer Documentation for powerplant

Last updated: Jul 28, 2017


Introduction
============

**Dev aside** Hi. I (Simon, my email's at the end of this section) wrote this document to outline some of the standards used in this software. It's very unfinished, and I apologize for that. The end of my time at the mill snuck up on me much quicker than I expected. If you continue working on this project, it would be awesome if you also continue working on the documentation. Thanks!

powerplant is a full-stack JS web app utilizing several external
services and many interlocking components. The aim of this doc is to
help you, as a developer, get familiar with all the parts of the
software. It should act as a roadmap, showing you where each
functionality of the software lies, and where each new functionality
belongs.

It would be helpful to have

-   A bit of working knowledge of javascript
    -   ES6 standards are a plus
-   Understanding of JS `Promises`
-   Understanding of the principles behind building a React app - see
    [Thinking in
    React](https://facebook.github.io/react/docs/thinking-in-react.html)
-   Knowledge of REST principles for building web APIs - see [RESTful
    Web Services](http://restfulwebapis.org/RESTful_Web_Services.pdf)

**NOTE** These would just be helpful. If you're like me, you started
with none of these except for a bit of JS.

**RELATED** If you see something in these docs that you think should be
changed or see existing code that you think is leading the project down
the wrong path and needs to be refactored or restructured, PLEASE work
to change it! The project is in its early stages, and there are many
features or implementation details that made it through simply because
the project is so small. Also, I apologize if you find any awful code.

You can send questions, complaints, or hate mail to
simoneverhale@gmail.com

Setup
=====

To start, you need to set up the development environment. This includes:
NodeJS, Docker (with mongo db)

1.  [Install Node](https://nodejs.org/en/download/package-manager/) you
    should install version 6.x
2.  [Install
    Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#install-using-the-repository)
3.  Install the [Mongo Docker image](https://hub.docker.com/_/mongo/) by
    running `docker pull mongo`
4.  Clone the [git
    repository](https://github.com/Ecohackerfarm/powerplant.git)
5. run `npm install` to get all packages installed
6. generate a private key and export it as a string in
   `/jwt-secret.js`
   ex: `export default 'random-string-comes-here'`
7.  Start the Docker image by running `npm run mongo`
8.  Run the Firebase data migration by running `npm run migrate`
9.  At this point, everything should be set up. Run `npm test` to make
    sure everything is working, and `npm start` to begin serving the
    website on `http://localhost:8080`
10. Done!

The project may not run properly after reboot because it fails to
connect to the database. Running `docker restart pp_main` fixes the
issue.

Architecture
============

Codebase
--------

The entire codebase, front and back, is written in ES6 using Babel to
transpile to CommonJS. Through Babel and webpack, some importing
conveniences are available, namely using a slash ('/') to specify the
root of the project, allowing for absolute imports rather than just
relative.

Documentation
-------------

Documentation can be found in the `/docs` folder. `/docs/index.html`
loads a fully navigatible documentation site. It is also available
online through github pages at
https://ecohackerfarm.github.io/powerplant

### JSDoc

All documentation is generated with JSDoc (and
[docstrap](https://www.npmjs.com/package/ink-docstrap) for the
template). See the http://usejsdoc.org/ for documentation on how to
properly document things. The documentation pattern used is to make
every folder and file a namespace (unless a file should not be its own
namespace, like if you only ever import it through the directory's
index.js). Each `namespace` should also specify who it is a `memberof`.
This allows for proper navigation of the file hierarchy in the
documentation. Additionally, a plugin called
[jsdoc-memberof-namespace](https://www.npmjs.com/package/jsdoc-memberof-namespace)
is used to generate proper nesting structure for methods, constants, and
classes within namespaces. This was the best way I could find to
maintain the right file hierarchy in the documentation.

The one exception is that classes can be documented as `class`es rather
than `namespace`s. This is only for things that you would instantiate
with the `new` keyword. Mongoose models, for example, can be documented
as classes because they are instantiated as `new` objects. Take a look
at `/server/models` for examples of how this works.

Here's an example for documenting a file called `bar` within a folder
called `foo` (although you should be able to find plenty in the code, at
least in `/server/data-validation`)

```
    // File: /foo/index.js
    /**
     * @namespace foo
     */

    // File: /foo/bar.js
    /**
     * @namespace bar
     * @memberof foo
     */
```

Pretty simple, right? Make sure to specify the full namespace in
`memberof`, e.g. if foo was contained within baz, in bar you'd say it's
a member of `baz.foo`, not just `foo`. You might need to add a few
index.js files if there are folders that don't have them already.\
NOTE: If you notice a function being skipped in the documentation, check
if it's a default export! jsdoc-memberof-namespace has trouble with
inline default export function declarations. Better to declare the
function, then default export it, otherwise it may be skipped.

Testing
-------

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

Front end
---------

### React, react-router-dom

### Redux + redux-peresist + react-redux

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

### React-bootstrap

### Webpack

Back end
--------

### Node

### Express

### Mongoose

Mongoose is an ODM (object-document-model) library for Mongo DB. It
abstracts some of the lower level features of mongo and makes it easy to
create models and control them.

The database structure follows a relatively straightforward hierarchy:

```
    +------------------------------------+
    |      User                          |
    +------------------------------------+
    |       _id:ObjectId                 |
    |  username:String                   |
    |  password:String                   |
    | locations:[ObjectId(ref:Location)] |
    |                                    |
    +n------------^----------------------+
     |            |
     |            |
     |          user
    locations     |
     |            |
     |            |
    +v------------1+---------------+
    |     Location                 |
    +------------------------------+
    |   _id:ObjectId               |
    |  beds:[Bed]                  |
    |   loc:{coordinates:[Number], |
    |         address:String}      |
    |  user:ObjectId(ref:User)     |
    |                              |
    +----n--------------^----------+
         |              |
       beds          location
         |              |
    +----v--------------1-----------------+
    |          Bed                        |
    +-------------------------------------+
    |          _id:ObjectId               |
    | active_crops:[ObjectId(ref:Crop)]   |
    |   past_crops:[ObjectId(ref:Crop)]   |
    |    soil_type:Enum                   |
    |     location:ObjectId(ref:Location) |
    |                                     |
    |                                     |
    +-----n------------^------------------+
          |            |
       active_crops    |
       past_crops     bed
          |            |
    +-----v------------1----------------------+
    |     Crop                                |
    +-----------------------------------------+
    |       _id:ObjectId                      |
    |  bed:ObjectId(ref:Bed)                  |
    |  crop_info:ObjectId(ref:CropInformation)|
    |  planted_indoors:Date                   |
    |  planted_in_bed:Date                    |
    |  predicted_transplant:Date              |
    |  predicted_harVest:Date                 |
    +-----------------------------------------+
```

Common tasks
============

Front end
---------

### Adding tests

### Adding a new page

Back end
--------

### Adding tests

#### Unit tests

#### Integration tests

### Modifying the database structure
