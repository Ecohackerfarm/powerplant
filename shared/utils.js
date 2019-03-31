/**
 * @namespace shared
 */

/**
 * @param {Crop[]} crops
 * @return {String[]}
 */
function findTagSet(crops) {
  let tagSet = [];
  crops.forEach(crop => {
    const newTags = getCropTagNames(crop).filter(tag => (!tagSet.includes(tag)));
    tagSet = tagSet.concat(newTags);
  });
  return tagSet;
}

/**
 * @param {Crop} crop
 * @return {String[]}
 */
function getCropTagNames(crop) {
  return crop.tags.map(tag => tag.name);
}

/**
 * Every crop has a binomial name, common name is optional.
 *
 * @param {Crop} crop
 * @return {String}
 */
function getCropDisplayName(crop) {
  return crop.commonName ? (crop.commonName + ' (' + crop.binomialName + ')') : crop.binomialName;
}

module.exports = {
  findTagSet,
  getCropTagNames,
  getCropDisplayName
};
