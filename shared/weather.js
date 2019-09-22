/**
 *
 * @namespace shared
 */

require('dotenv').config();

const DarkSky = require('dark-sky');
const darksky = new DarkSky(process.env.DARKSKY_API_KEY);

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise: Promise
});

/**
 *
 * @param {Object} location Longitude and latitude
 * @return {Array} All frost and rain warnings for a given location
 */
async function getFrostAndRainWarnings(location) {
  try {
    if (!location) {
      throw new Error('must specify location');
    } else {
      if (typeof location === 'string') {
        location = await getCoordinates(location);
      } else if (!Array.isArray(location) && typeof location !== 'function') {
        if (Object.keys(location).length < 1) {
          throw new Error('coordinates cannot be empty');
        }
      } else {
        throw new Error('location is not an address or a coordinate');
      }
    }

    const data = await darksky
      .coordinates(location)
      .exclude('currently,minutely,hourly,daily,flags')
      .get();

    return data.alerts.filter(alert => {
      return (
        alert.severity.search(/warning/i) > -1 &&
        alert.title.search(/frost|freeze|rain|flood|thunder/i) > -1
      );
    });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 *
 * @param {String} address
 * @return {Object} Longitude and latitude of the address
 */
async function getCoordinates(address) {
  try {
    if (typeof address !== 'string') {
      throw new Error('address must be a string');
    }

    if (address === '') {
      throw new Error('address cannot be empty');
    }

    const data = await googleMapsClient
      .geocode({ address: address })
      .asPromise();
    return data.json.results[0].geometry.location;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 *
 * @param {Array} locationArray Array with longitude and latitude
 * @return {String} Address of given location
 */
async function getAddress(locationArray) {
  try {
    if (!Array.isArray(locationArray)) {
      throw new Error('location must be array');
    }

    if (locationArray.length < 2) {
      throw new Error('array must have 2 elements');
    }

    if (!locationArray.every(elem => typeof elem === 'number')) {
      throw new Error('location array has non-numeric element');
    }

    const data = await googleMapsClient
      .reverseGeocode({ coordinates: locationArray })
      .asPromise();
    return data.json.results[0].formatted_address;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getFrostAndRainWarnings
};
