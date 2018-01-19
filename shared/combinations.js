/**
 * @namespace combinations
 * @memberof shared
 */

/**
 * Check if given set contains the given element.
 * 
 * @param {Array} combination
 * @param {Object} element
 * @return {Boolean}
 */
function combinationContainsElement(combination, element) {
	return combination.some(combinationElement => combinationElement == element);
}

/**
 * Check if two arrays are the same set, that is, they contain the
 * same elements.
 * 
 * TODO: Rename. Also, make it a static method of Combinations?
 * 
 * @param {Array} combination0
 * @param {Array} combination1
 * @return {Boolean}
 */
function areEqualCombinations(combination0, combination1) {
	return combination0.every(element =>
		combinationContainsElement(combination1, element)
	);
}

/**
 * Represents all compatible combinations of the given elements.
 * 
 * Elements must have the isCompatible() method that determines if two
 * elements are compatible with each other.
 */
class Combinations {
	/**
	 * Construct the combinations.
	 * 
	 * @param {Array} elements
	 */
	constructor(elements) {
		this.combinations = [];
		this.combinations.push(null);
		this.combinations.push(elements.map(element => [element]));

		let combinationSize = 1;
		for (;;) {
			let newCombinations = [];
			this.combinations[combinationSize].forEach(combination => {
				elements.forEach(element => {
					// Try to form a new larger combination with the given element
					if (
						!combination.includes(element) &&
						combination.every(combinationElement =>
							combinationElement.isCompatible(element)
						)
					) {
						let newCombination = combination.concat([element]);
						// Check if the new combination is unique
						if (
							newCombinations.length == 0 ||
							newCombinations.every(
								anotherNewCombination =>
									!areEqualCombinations(anotherNewCombination, newCombination)
							)
						) {
							newCombinations.push(newCombination);
						}
					}
				});
			});

			if (newCombinations.length == 0) {
				break;
			}

			this.combinations.push(newCombinations);
			combinationSize++;
		}
	}

	/**
	 * Get the size of the largest compatible combination.
	 * 
	 * @return {Number}
	 */
	getLargestCombinationSize() {
		for (let index = this.combinations.length - 1; index > 0; index--) {
			if (this.combinations[index].length > 0) {
				return index;
			}
		}

		return 1;
	}

	/**
	 * Get combinations of given size.
	 * 
	 * @param {Number} size
	 */
	getCombinations(size) {
		return this.combinations[size];
	}

	/**
	 * Get the elements.
	 * 
	 * @return {Array}
	 */
	getElements() {
		return this.combinations[1].map(combination => combination[0]);
	}

	/**
	 * Remove the given element and update combinations.
	 * 
	 * @param {Object} element
	 */
	removeElement(element) {
		for (let size = 1; size <= this.getLargestCombinationSize(); size++) {
			this.combinations[size] = this.combinations[size].filter(
				combination => !combinationContainsElement(combination, element)
			);
		}
	}

	/**
	 * Remove a set of elements.
	 * 
	 * @param {Array} combination
	 */
	removeElements(combination) {
		for (let index = 0; index < combination.length; index++) {
			this.removeElement(combination[index]);
		}
	}

	/**
	 * Get the largest combination that contains the given smaller combination.
	 *
	 * @param {Array} elements
	 * @return {Array}
	 */
	getLargestCombinationWithElements(elements) {
		let size = elements.length;
		let largestCombination = [];

		while (size <= this.getLargestCombinationSize()) {
			const found = this.getCombinations(size).some(combination => {
				const valid = elements.every(element =>
					combinationContainsElement(combination, element)
				);

				if (valid) {
					largestCombination = combination;
				}

				return valid;
			});

			if (!found) {
				break;
			}

			size++;
		}

		return largestCombination;
	}
}

export {
	Combinations,
	areEqualCombinations
};
