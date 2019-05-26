'use strict';
//This file should stay in ES2015
Object.defineProperty(exports, "__esModule", {
  value: true
});

// this secret is used for encrypting user password and data
exports.JWT_SECRET = 'YOUR PRIVATE KEY HERE';
// this API need for locations https://developers.google.com/maps/documentation/geocoding/intro
exports.GOOGLE_GEOCODE_API_KEY = 'YOUR API KEY HERE';
// username and password for user which has
// 'readWrite' and 'dbAdmin' rights for DATABASE_DB
exports.DATABASE_USERNAME = '';
exports.DATABASE_PASSWORD = '';
// protocoll of the database, normally don't change that.
exports.DATABASE_PROTOCOLL = 'mongodb://';
// host address
exports.DATABASE_HOST = 'localhost';
// host port
exports.DATABASE_PORT = ''; // e.g. '27018'
// database name
exports.DATABASE_DB = 'pp_main'; // e.g. 'powerplant'
// API port
exports.HTTP_SERVER_PORT = '8080';
// host address of the api / address of the server
exports.HTTP_SERVER_HOST = 'localhost';
