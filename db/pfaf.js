/**
 * Support code for the crop database exported from practicalplants.org wiki.
 * 
 * @namespace pfaf
 * @memberof db
 */

const readline = require('readline');
const fs = require('fs');

/**
 * Read the whole mongoexport file to an array of crop objects.
 * 
 * @return {Array} Crop objects
 */
function readCrops() {
	const lines = fs.readFileSync(__dirname + '/pfaf.json', { encoding: 'latin1' }).split('\n');
	return lines.splice(0, lines.length - 1).map(line => JSON.parse(line));
}

module.exports = {
	readCrops
};
