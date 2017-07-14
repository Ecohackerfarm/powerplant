Developer Documentation for powerplant
Last updated: Jul 14, 2017

{{>toc}}

h1. Introduction

powerplant is a full-stack JS web app utilizing several external services and many interlocking components. The aim of this doc is to help you, as a developer, get familiar with all the parts of the software. It should act as a roadmap, showing you where each functionality of the software lies, and where each new functionality belongs.

h1. Architecture

h2. Codebase

The entire codebase, front and back, is written in ES6 using Babel to transpile to CommonJS.

h2. Testing

Tests are stored in the @/test@ folder. The structure of this folder should mirror the root file structure. This makes it easy to find the test module for any module. Tests should be written for every component that contains business logic or helper functions, as well as every API route. No tests need to be written for external library functions (like Mongoose @Models@). However, if you write an extensions to an external function, like a query function for a Mongoose @Model@, that should be tested.

Whenever possible, use unit testing to test a single component separate from the rest of the codebase.

If isolation is not possibe, integration tests are ok too. This is necessary for API tests, and possibly also for database functions.

All tests are dispatched with Mocha and use the @expect@ function from the assertion library Chai. API tests use supertest to create requests.

h3. Mocha

https://mochajs.org/

Mocha is the test-running framework which is used to organize the tests. We use the BDD (behaviour-drive-development) syntax, so the main function used to organize tests is @describe@. Generally, tests for a module are organized with two levels of @describe, the first being the name of the module, and the second being for a specific function or functionality. Test code then goes within the secondFor example:

<pre>
describe('data-validation', () => { // module name
    describe('#idValidation()', () => { // function name
        // test code for idValidation goes here
    });
    describe('#getCompanionshipScores()', () => { // other function name
        // test code for getCompanionshipScores
    });
});
</pre>

<pre>
describe('authReducer', () => {

}
</pre>

h3. Chai

h3. Supertest


h2. Front end

h3. React, react-router-dom

h3. Redux

h3. React-bootstrap

h3. Webpack


h2. Back end

h3. Node

h3. Express

h3. Mongoose



h1. Common tasks


h2. Front end

h3. Adding tests

h3. Adding a new page


h2. Back end

h3. Adding tests

h4. Unit tests

h4. Integration tests

h3. Modifying the database structure
