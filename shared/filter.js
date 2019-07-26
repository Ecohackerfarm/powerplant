/**
 * Crop filtering
 *
 * @namespace filter
 * @memberof shared
 */

const { areCompatible, calculateGoodness } = require('./companionship.js');

/**
 * @param {Array} allCrops
 * @param {Array} cropsInBed
 * @param {Array} filters
 * @param {Boolean} sort
 * @return {Array}
 */
function filterAndSort(allCrops, cropsInBed, filters, sort) {
  const filteredCrops = filter(allCrops, filters);
  const compatibleCrops = filteredCrops.filter(crop =>
    areCompatible(cropsInBed.concat([crop]))
  );

  let finalCrops;
  if (sort) {
    const nameToScore = {};
    compatibleCrops.forEach(crop => {
      nameToScore[crop.binomialName] = calculateGoodness(
        cropsInBed.concat([crop])
      );
    });

    finalCrops = compatibleCrops.sort(
      (crop0, crop1) =>
        nameToScore[crop1.binomialName] - nameToScore[crop0.binomialName]
    );
  } else {
    finalCrops = compatibleCrops;
  }

  return finalCrops;
}

/**
 * @param {Array} crops
 * @param {Array} filters
 * @return {Array}
 */
function filter(crops, filters) {
  if (filters.length === 0) {
    return crops;
  }
  return crops.filter(crop => choose(crop, filters));
}

/**
 * @param {Object} crop
 * @param {Array} filters
 * @return {Array}
 */
function choose(crop, filters) {
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    const value = crop[filter.property];
    switch (filter.property) {
      case 'commonName':
      case 'binomialName':
        if (
          value &&
          value.toLowerCase().includes(filter.search.toLowerCase())
        ) {
          return true;
        }
        break;
      case 'hardinessZone':
      case 'matureHeight':
      case 'matureWidth':
        if (filter.min <= value && value <= filter.max) {
          return true;
        }
        break;
      case 'poorNutrition':
      case 'wind':
      case 'maritime':
      case 'pollution':
        if (
          (value === 'true' && filter.value) ||
          (value === 'false' && !filter.value)
        ) {
          return true;
        }
        break;
      case 'soilTexture':
      case 'soilPh':
      case 'soilWaterRetention':
      case 'shade':
      case 'sun':
      case 'water':
      case 'drought':
      case 'ecosystemNiche':
      case 'lifeCycle':
      case 'herbaceousOrWoody':
      case 'deciduousOrEvergreen':
      case 'growthRate':
      case 'flowerType':
      case 'pollinators':
      case 'functions':
      case 'growFrom':
      case 'cuttingType':
      case 'fertility':
      case 'rootZone':
        const values = filter.values;
        for (let k = 0; k < values.length; k++) {
          if (value.includes(values[k])) {
            return true;
          }
        }
        break;
    }
  }
  return false;
}

module.exports = {
  filterAndSort
};
