/**
 * @param {Array} combination
 * @param {Object} element
 * @return {Boolean}
 */
function combinationContainsElement(combination, element) {
	return combination.some(combinationElement => combinationElement == element);
}

/**
 * @param {Array} combination0
 * @param {Array} combination1
 * @return {Boolean}
 */
export function areEqualCombinations(combination0, combination1) {
	return combination0.every(element =>
		combinationContainsElement(combination1, element)
	);
}

/**
 * Elements must have the isCompatible() method that determines if two elements
 * are compatible with each other.
 */
export class Combinations {
	/**
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
	 * @param {Number} size
	 */
	getCombinations(size) {
		return this.combinations[size];
	}

	/**
	 * @return {Array}
	 */
	getElements() {
		return this.combinations[1].map(combination => combination[0]);
	}

	/**
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
