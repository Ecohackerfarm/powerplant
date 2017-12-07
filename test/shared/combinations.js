import assert from 'assert';
import { Combinations, areEqualCombinations } from '/shared/combinations.js';

/**
 * @return {Combinations}
 */
function createCombinations() {
	let elements = [0, 1, 2, 3];
	elements = elements.map(number => {
		const element = new Number(number);
		element.isCompatible = function(anotherElement) {
			return this != anotherElement;
		};
		return element;
	});

	return new Combinations(elements);
}

/**
 * Assert that the given sets of combinations are equal.
 *
 * @param {Array} actual
 * @param {Array} expected
 */
function assertCombinations(actual, expected) {
	const equal = actual.every(actualCombination =>
		expected.some(expectedCombination =>
			areEqualCombinations(actualCombination, expectedCombination)
		)
	);
	assert.equal(
		equal,
		true,
		'Sets of combinations of size ' + actual[0].length + ' are not equal'
	);
}

describe('Combinations', () => {
	it('generates correct combinations', () => {
		const combinations = createCombinations();

		assertCombinations([[0], [1], [2], [3]], combinations.getCombinations(1));
		assertCombinations(
			[[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
			combinations.getCombinations(2)
		);
		assertCombinations(
			[[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]],
			combinations.getCombinations(3)
		);
	});
	it('removes all combinations that contain the removed element', () => {
		const combinations = createCombinations();
		combinations.removeElement(0);

		assertCombinations([[1], [2], [3]], combinations.getCombinations(1));
		assertCombinations(
			[[1, 2], [1, 3], [2, 3]],
			combinations.getCombinations(2)
		);
		assertCombinations([[1, 2, 3]], combinations.getCombinations(3));
	});
});
