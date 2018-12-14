/**
 * Companionship algorithm
 *
 * @namespace companionship
 * @memberof shared
 */

const practicalplants = require('../db/practicalplants.js');

/**
 * Calculate a companionship score that represents something like "overall
 * holistic goodness" of the given crops and their surrounding ecosystems
 * when the crops are grown together.
 *
 * @param {Array} crops Normalized crop data from practicalplants.org
 * @return {Number} Positive number, or 0 for incompatible.
 */
function calculateCompanionshipScore(crops) {
  let score;
  if (areCompatible(crops)) {
    score = calculateGoodness(crops);
  } else {
    score = 0;
  }
  return score;
}

/**
 * Determine whether the crops are compatible with each other. Compatibility
 * means that the crops are able to grow in the same kind of environment.
 *
 * All compatibility functions take one input parameter, the array of crops,
 * and return a boolean.
 *
 * @param {Array} crops
 * @return {Boolean}
 */
function areCompatible(crops) {
  return compatibilityValues.every(compatibilityValue => compatibilityValue(crops));
}

const compatibilityValues = [
  isSoilTextureCompatible,
  isSoilPhCompatible,
  isSoilWaterRetentionCompatible,
  isWaterCompatible,
  isSunCompatible,
  isShadeCompatible,
  isHardinessZoneCompatible,
  isDroughtCompatible,
  isExplicitCompanionshipStatusCompatible
];

/**
 * Calculate goodness for the given set of crops.
 *
 * Each individual goodness value represents how much of some feature is
 * present in the input set of crops. This feature may be anything that looks
 * useful. For example the diversity of different plant features is one class
 * of goodness values.
 *
 * All goodness functions take one input parameter, the array of crops, and
 * return a number between 0 and 1. Each goodness function is also associated
 * with a factor that specifies how important it is in relation to other
 * goodness values.
 *
 * @param {Array} crops
 * @return {Number}
 */
function calculateGoodness(crops) {
  let goodness = 0;
  goodnessValues.forEach(value => {
    goodness += value.importanceFactor * value.goodnessFunction(crops);
  });
  return goodness;
}

const goodnessValues = [
  { goodnessFunction: getEcosystemNicheDiversity,       importanceFactor: 1 },
  { goodnessFunction: getLifeCycleDiversity,            importanceFactor: 1 },
  { goodnessFunction: getHerbaceousOrWoodyDiversity,    importanceFactor: 1 },
  { goodnessFunction: getDeciduousOrEvergreenDiversity, importanceFactor: 1 },
  { goodnessFunction: getGrowthRateDiversity,           importanceFactor: 1 },
  { goodnessFunction: getMatureHeightDiversity,         importanceFactor: 1 },
  { goodnessFunction: getMatureWidthDiversity,          importanceFactor: 1 },
  { goodnessFunction: getFlowerTypeDiversity,           importanceFactor: 1 },
  { goodnessFunction: getPollinatorsDiversity,          importanceFactor: 1 },
  { goodnessFunction: getFunctionsDiversity,            importanceFactor: 1 },
  { goodnessFunction: getGrowFromDiversity,             importanceFactor: 1 },
  { goodnessFunction: getCuttingTypeDiversity,          importanceFactor: 1 },
  { goodnessFunction: getFertilityDiversity,            importanceFactor: 1 },
  { goodnessFunction: getRootZoneDiversity,             importanceFactor: 1 },
];

/**
 * @param {Array} crops
 * @return {Boolean}
 */
function isSoilTextureCompatible(crops) {
  return areArrayValuesMatching(crops, 'soil texture');
}

/**
 * @param {Array} crops
 * @return {Boolean}
 */
function isSoilPhCompatible(crops) {
  return areArrayValuesMatching(crops, 'soil ph');
}

/**
 * @param {Array} crops
 * @return {Boolean}
 */
function isSoilWaterRetentionCompatible(crops) {
  return areArrayValuesMatching(crops, 'soil water retention');
}

/**
 * Aquatic plants are incompatible with non-aquatic plants.
 *
 * TODO Otherwise it might be too strict to specify that the values must match
 *      exactly, and too free to say that they may be anything non-aquatic.
 *      Try to specify that the crops may span two consecutive values?
 *
 * @param {Array} crops
 * @return {Boolean}
 */
function isWaterCompatible(crops) {
  return haveValue(crops, 'water', 'aquatic') ? areValuesMatching(crops, 'water') : true;
}

/**
 * TODO It might be too strict to specify that the values must match exactly,
 *      and too free to say that they may be anything. Try to specify that
 *      the crops may span two consecutive values?
 *
 * @param {Array} crops
 * @return {Boolean}
 */
function isSunCompatible(crops) {
  return true;
}

/**
 * TODO It might be too strict to specify that the values must match exactly,
 *      and too free to say that they may be anything. Try to specify that
 *      the crops may span two or three consecutive values?
 *
 * @param {Array} crops
 * @return {Boolean}
 */
function isShadeCompatible(crops) {
  return true;
}

/**
 * Check that the hardiness zones span the maximum of two consecutive values.
 *
 * @param {Array} crops
 * @return {Boolean}
 */
function isHardinessZoneCompatible(crops) {
  const zones = crops.map(crop => crop['hardiness zone']);
  zones.sort((a, b) => (a - b));
  
  let first = zones.find(zone => (zone > 0));
  first = (first === undefined) ? 0 : first;
  
  const last = zones[zones.length - 1];
  
  return (last - first) <= 1;
}

/**
 * @param {Array} crops
 * @return {Boolean}
 */
function isDroughtCompatible(crops) {
  return areValuesMatching(crops, 'drought');
}

/**
 * @param {Array} crops
 * @return {Boolean}
 */
function isExplicitCompanionshipStatusCompatible(crops) {
  /*
   * TODO Check that the crops are either companions or neutral in our
   * companionship database (db/companions.js).
   */
  return true;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getEcosystemNicheDiversity(crops) {
  return getNumberOfDifferentValuesInArrays(crops, 'ecosystem niche') / practicalplants.PP_ECOSYSTEM_NICHE_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getLifeCycleDiversity(crops) {
  return getNumberOfDifferentValues(crops, 'life cycle') / practicalplants.PP_LIFE_CYCLE_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getHerbaceousOrWoodyDiversity(crops) {
  return getNumberOfDifferentValues(crops, 'herbaceous or woody') / practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getDeciduousOrEvergreenDiversity(crops) {
  return getNumberOfDifferentValues(crops, 'deciduous or evergreen') / practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getGrowthRateDiversity(crops) {
  return getNumberOfDifferentValues(crops, 'growth rate') / practicalplants.PP_GROWTH_RATE_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getFlowerTypeDiversity(crops) {
  return getNumberOfDifferentValues(crops, 'flower type') / practicalplants.PP_FLOWER_TYPE_VALUES.length;
}

/**
 * TODO Divide height into half-meter ranges and count how many different
 *      ranges the crops span.
 *
 * @param {Array} crops
 * @return {Number}
 */
function getMatureHeightDiversity(crops) {
  return 0;
}

/**
 * TODO Divide width into half-meter ranges and count how many different
 *      ranges the crops span.
 */
function getMatureWidthDiversity(crops) {
  return 0;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getPollinatorsDiversity(crops) {
  return getNumberOfDifferentValuesInArrays(crops, 'pollinators') / practicalplants.PP_POLLINATORS_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getFunctionsDiversity(crops) {
  return getNumberOfDifferentValuesInArrays(crops, 'functions') / practicalplants.PP_FUNCTIONS_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getGrowFromDiversity(crops) {
  return getNumberOfDifferentValuesInArrays(crops, 'grow from') / practicalplants.PP_GROW_FROM_VALUES.length;;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getCuttingTypeDiversity(crops) {
  return getNumberOfDifferentValuesInArrays(crops, 'cutting type') / practicalplants.PP_CUTTING_TYPE_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getFertilityDiversity(crops) {
  return getNumberOfDifferentValuesInArrays(crops, 'fertility') / practicalplants.PP_FERTILITY_VALUES.length;
}

/**
 * @param {Array} crops
 * @return {Number}
 */
function getRootZoneDiversity(crops) {
  return getNumberOfDifferentValues(crops, 'root zone') / practicalplants.PP_ROOT_ZONE_VALUES.length;
}

/**
 * @param {Array}   crops
 * @param {String}  property
 * @return {Number}
 */
function getNumberOfDifferentValuesInArrays(crops, property) {
  const values = [];
  crops.forEach(crop => {
    crop[property].forEach(value => {
      if (!values.includes(value)) {
        values.push(value);
      }
    });
  });
  return values.length;
}

/**
 * @param {Array}   crops
 * @param {String}  property
 * @return {Number}
 */
function getNumberOfDifferentValues(crops, property) {
  const values = [];
  crops.forEach(crop => {
    const value = crop[property];
    if (!values.includes(value)) {
      values.push(value);
    }
  });
  return values.length;
}

/**
 * @param {Array} crops
 * @param {String} property
 * @param {Object} value
 * @return {Boolean}
 */
function haveValue(crops, property, value) {
  return crops.some(crop => (crop[property] == value));
}

/**
 * @param {Array} crops
 * @param {String} property
 * @return {Boolean}
 */
function areArrayValuesMatching(crops, property) {
  return crops[0][property].filter(value => crops.every(crop => crop[property].includes(value))).length > 0;
}

/**
 * @param {Array} crops
 * @param {String} property
 * @return {Boolean}
 */
function areValuesMatching(crops, property) {
  return crops.every(crop => (crop[property] == crops[0][property]));
}

module.exports = {
  calculateCompanionshipScore,
  
  compatibilityValues,
  goodnessValues,
  
  isSoilTextureCompatible,
  isSoilPhCompatible,
  isSoilWaterRetentionCompatible,
  isWaterCompatible,
  isSunCompatible,
  isShadeCompatible,
  isHardinessZoneCompatible,
  isDroughtCompatible,
  isExplicitCompanionshipStatusCompatible,
  
  getFunctionsDiversity,
  getFlowerTypeDiversity
};
