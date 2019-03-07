/**
 * TODO Most of this should be eventually integrated with the new companionship
 * algorithm.
 *
 * @namespace shared
 */

const { Combinations } = require('./combinations.js');

/**
 * Get other crops that are compatible with the given set of crops.
 * The crops in the sum set are all compatible.
 *
 * TODO This doesn't scale at all with thousands of crops.
 *
 * @param {Object[]} allCrops
 * @param {Object[]} relationships
 * @param {Object[]} crops
 * @return {Object[]} Array of compatible crops
 */
function getCompatibleCrops(allCrops, relationships, crops) {
  assignRelationships(relationships, allCrops);
	assignIsCompatible(allCrops, isCompanion);
	const combinations = new Combinations(allCrops, crops.length + 1);

	const initialCrops = crops.map(a => allCrops.find(b => a._id == b._id));

	const compatibleCrops = combinations
		.getLargestCombinationWithElements(initialCrops)
		.filter(crop => !initialCrops.includes(crop));

	compatibleCrops.forEach(crop => {
		delete crop.relationships;
		delete crop.isCompatible;
	});
	return compatibleCrops;
}

/**
 * Divide the given crops into groups of compatible crops.
 *
 * @param {Object[]} relationships
 * @param {Object[]} crops
 * @return {Object[]} Array of crop groups
 */
function getCropGroups(relationships, crops) {
  assignRelationships(relationships, crops);
  
	let groups = [];

	// Create groups of companion crops
	assignIsCompatible(crops, isCompanion);
	const companionCombinations = new Combinations(crops);
	groups = groups.concat(
			removeCropGroupsFromCombinations(
					companionCombinations,
					companionCombinations.getLargestCombinationSize()
			)
	);

	// From the remaining crops, create small groups of neutral crops
	const remainingCrops = companionCombinations.getElements();
	assignIsCompatible(remainingCrops, isNeutral);
	const neutralCombinations = new Combinations(remainingCrops);
	if (neutralCombinations.getLargestCombinationSize() >= 2) {
			groups = groups.concat(
					removeCropGroupsFromCombinations(neutralCombinations, 2)
			);
	}

	// From the remaining crops, create single crop groups
	groups = groups.concat(neutralCombinations.getCombinations(1));

	groups.forEach(group =>
			group.forEach(crop => {
					delete crop.relationships;
					delete crop.isCompatible;
			})
	);
	return groups;
}

/**
 * Given all compatible combinations, get non-overlapping crop groups,
 * and update the Combinations object by removing the crops of these
 * groups.
 *
 * @param {Combinations} combinations
 * @param {Number} maximumGroupSize
 * @return {Array}
 */
function removeCropGroupsFromCombinations(combinations, maximumGroupSize) {
	const groups = [];

	while (maximumGroupSize >= 2) {
		const cursorCombinations = combinations.getCombinations(maximumGroupSize);
		if (cursorCombinations.length > 0) {
			const combination = cursorCombinations[0];
			combinations.removeElements(combination);
			groups.push(combination);
		} else {
			maximumGroupSize--;
		}
	}

	return groups;
}

function assignRelationships(relationships, crops) {
  for (let index = 0; index < crops.length; index++) {
    const crop = crops[index];
    crop.relationships = relationships.filter(relationship => containsCrop(relationship, crop));
  }
}

/**
 * Assign isCompatible() for the given Crop documents for use with the
 * Combinations class.
 *
 * @param {Crop[]} crops
 * @param {Function} isCompatibleFunction
 */
function assignIsCompatible(crops, isCompatibleFunction) {
	crops.forEach(crop => {
		crop.isCompatible = isCompatibleFunction;
	});
}

/**
 * Implements isCompatible() for Crop Combinations. Check if the given
 * other crop is compatible.
 *
 * @param {Crop} crop
 * @return {Boolean}
 */
function isCompanion(crop) {
	return this.relationships.some(
		(relationship) =>
			(containsCrop(relationship, crop) && (relationship.compatibility > 0))
	);
}

/**
 * Implements isCompatible() for Crop Combinations. Check if the given
 * other crop is neutral but not incompatible.
 *
 * @param {Crop} crop
 * @return {Boolean}
 */
function isNeutral(crop) {
	return this.relationships.some(
		(relationship) =>
			!containsCrop(relationship, crop) ||
			(containsCrop(relationship, crop) && (relationship.compatibility == 0))
	);
}

/**
 * @param {Object} relationship
 * @param {Object} crop
 * @return {Boolean}
 */
function containsCrop(relationship, crop) {
	const id = crop._id;
	return (relationship.crop0 == id) || (relationship.crop1 == id);
}

module.exports = {
  getCropGroups,
  getCompatibleCrops
};
