/**
 * Companion plant database.
 * 
 * @namespace companions
 * @memberof db
 */

/**
 * Used internally to add entries to the list of companions.
 * 
 * @param {String} plant0
 * @param {String} plant1
 * @param {Number} companion 0 for incompatible, 1 for companion
 */
function add(plant0, plant1, companion) {
	if (plant0 == plant1) {
		console.log('companions.js: plant is always companion with itself');
		return;
	}

	addPlant(plant0);
	addPlant(plant1);

	if (getCompanionValue(plant0, plant1)) {
		console.log('companions.js: duplicate companion entry');
	} else {
		companions.push({
			plant0: plant0,
			plant1: plant1,
			companion: companion
		});
	}
}

/**
 * Get companionship value of two plants.
 * 
 * @param {String} plant0 
 * @param {String} plant1 
 * @return {Number} 0 for incompatible, 1 for companion, undefined for neutral.
 */
function getCompanionValue(plant0, plant1) {
	if ((!plants.includes(plant0)) || (!plants.includes(plant1))) {
		return undefined;
	}
	if (plant0 == plant1) {
		return 1;
	}

	let value = getCompanionValueWithExactOrder(plant0, plant1);
	if (value === undefined) {
		value = getCompanionValueWithExactOrder(plant1, plant0);
	}
	return value;
}

/**
 * Helper for getting a companionship value.
 * 
 * @param {String} plant0 
 * @param {String} plant1 
 * @return {Number}
 */
function getCompanionValueWithExactOrder(plant0, plant1) {
	let entry = companions.find(entry => ((entry.plant0 == plant0) && (entry.plant1 == plant1)));
	return entry ? entry.companion : entry;
}

/**
 * Helper for adding entries.
 * 
 * @param {String} plant 
 */
function addPlant(plant) {
	if (!plants.includes(plant)) {
		plants.push(plant);
	}
}

let plants = [];
let companions = [];

add('Apple', 'Chives', 1);
add('Apple', 'Garlic', 1);
add('Apple', 'Horseradish', 1);
add('Apple', 'Lemon', 1);
add('Apple', 'Marigold', 1);
add('Apple', 'Mustard', 1);
add('Apple', 'Nasturtiums', 1);
add('Apple', 'Potato', 0);
add('Apple', 'Spinach', 1);
add('Apple', 'Tansy', 1);
add('Apple', 'Yarrow', 1);
add('Apricot', 'Basil', 1);
add('Apricot', 'Garlic', 1);
add('Apricot', 'Horseradish', 1);
add('Apricot', 'Lemon', 1);
add('Apricot', 'Marigold', 1);
add('Apricot', 'Mustard', 1);
add('Apricot', 'Nasturtiums', 1);
add('Apricot', 'Spinach', 1);
add('Apricot', 'Sunflower', 1);
add('Apricot', 'Tansy', 1);
add('Apricot', 'Tomato', 0);
add('Apricot', 'Yarrow', 1);
add('Asparagus', 'Basil', 1);
add('Asparagus', 'Chives', 1);
add('Asparagus', 'Marjoram', 1);
add('Asparagus', 'Parsley', 1);
add('Asparagus', 'Tomato', 1);
add('Basil', 'Chives', 1);
add('Basil', 'Cucumber', 1);
add('Basil', 'Fennel', 1);
add('Basil', 'Rue', 0);
add('Basil', 'Silverbeet', 0);
add('Basil', 'Tomato', 1);
add('Beans', 'Beets', 1);
add('Beans', 'Broccoli', 1);
add('Beans', 'Brussel sprouts', 1);
add('Beans', 'Cabbages', 1);
add('Beans', 'Carrots', 1);
add('Beans', 'Chives', 0);
add('Beans', 'Corn', 1);
add('Beans', 'Cucumber', 1);
add('Beans', 'Eggplant', 1);
add('Beans', 'Fennel', 0);
add('Beans', 'Garlic', 0);
add('Beans', 'Grape vine', 1);
add('Beans', 'Lettuce', 1);
add('Beans', 'Marigold', 1);
add('Beans', 'Marjoram', 1);
add('Beans', 'Onions', 0);
add('Beans', 'Parsley', 1);
add('Beans', 'Parsnip', 1);
add('Beans', 'Peas', 1);
add('Beans', 'Potato', 1);
add('Beans', 'Rosemary', 1);
add('Beans', 'Sage', 1);
add('Beans', 'Savoy', 1);
add('Beans', 'Shallots', 1);
add('Beets', 'Borage', 1);
add('Beets', 'Cabbages', 1);
add('Beets', 'Climbing beans', 0);
add('Beets', 'Dill', 1);
add('Beets', 'Lettuce', 1);
add('Beets', 'Marjoram', 1);
add('Beets', 'Onions', 1);
add('Beets', 'Potato', 1);
add('Beets', 'Silverbeet', 1);
add('Beets', 'Tomato', 0);
add('Borage', 'Broccoli', 1);
add('Borage', 'Brussel sprouts', 1);
add('Borage', 'Cabbages', 1);
add('Borage', 'Cauliflower', 1);
add('Borage', 'Cucumber', 1);
add('Borage', 'Strawberries', 1);
add('Borage', 'Tansy', 1);
add('Borage', 'Tomato', 1);
add('Broad beans', 'Broccoli', 1);
add('Broad beans', 'Brussel sprouts', 1);
add('Broad beans', 'Cabbages', 1);
add('Broad beans', 'Cauliflower', 1);
add('Broad beans', 'Chives', 0);
add('Broad beans', 'Corn', 1);
add('Broad beans', 'Fennel', 0);
add('Broad beans', 'Garlic', 0);
add('Broad beans', 'Lettuce', 1);
add('Broad beans', 'Marjoram', 1);
add('Broad beans', 'Onions', 0);
add('Broad beans', 'Potato', 1);
add('Broad beans', 'Spinach', 1);
add('Broccoli', 'Climbing beans', 1);
add('Broccoli', 'Coriander', 1);
add('Broccoli', 'Cucumber', 1);
add('Broccoli', 'Dill', 1);
add('Broccoli', 'Marigold', 1);
add('Broccoli', 'Marjoram', 1);
add('Broccoli', 'Nasturtiums', 1);
add('Broccoli', 'Potato', 1);
add('Broccoli', 'Rue', 0);
add('Broccoli', 'Strawberries', 1);
add('Broccoli', 'Tomato', 1);
add('Brussel sprouts', 'Climbing beans', 1);
add('Brussel sprouts', 'Coriander', 1);
add('Brussel sprouts', 'Cucumber', 1);
add('Brussel sprouts', 'Dill', 1);
add('Brussel sprouts', 'Marigold', 1);
add('Brussel sprouts', 'Marjoram', 1);
add('Brussel sprouts', 'Potato', 1);
add('Brussel sprouts', 'Strawberries', 0);
add('Brussel sprouts', 'Sunflower', 1);
add('Bush beans', 'Cabbages', 1);
add('Bush beans', 'Celery', 1);
add('Bush beans', 'Chives', 0);
add('Bush beans', 'Corn', 1);
add('Bush beans', 'Cucumber', 1);
add('Bush beans', 'Garlic', 0);
add('Bush beans', 'Marjoram', 1);
add('Bush beans', 'Onions', 0);
add('Bush beans', 'Potato', 1);
add('Bush beans', 'Strawberries', 1);
add('Bush beans', 'Sunflower', 1);
add('Cabbages', 'Camomile', 1);
add('Cabbages', 'Celery', 1);
add('Cabbages', 'Climbing beans', 1);
add('Cabbages', 'Coriander', 1);
add('Cabbages', 'Cucumber', 1);
add('Cabbages', 'Dill', 1);
add('Cabbages', 'Garlic', 0);
add('Cabbages', 'Lavender', 1);
add('Cabbages', 'Lettuce', 1);
add('Cabbages', 'Marigold', 1);
add('Cabbages', 'Marjoram', 1);
add('Cabbages', 'Mints', 1);
add('Cabbages', 'Nasturtiums', 1);
add('Cabbages', 'Onions', 1);
add('Cabbages', 'Peas', 1);
add('Cabbages', 'Potato', 1);
add('Cabbages', 'Rosemary', 1);
add('Cabbages', 'Rue', 0);
add('Cabbages', 'Sage', 1);
add('Cabbages', 'Strawberries', 0);
add('Cabbages', 'Tansy', 1);
add('Cabbages', 'Thyme', 1);
add('Cabbages', 'Tomato', 0);
add('Camomile', 'Mints', 0);
add('Carrots', 'Chives', 1);
add('Carrots', 'Coriander', 1);
add('Carrots', 'Cucumber', 1);
add('Carrots', 'Dill', 1);
add('Carrots', 'Fruit trees', 1);
add('Carrots', 'Leeks', 1);
add('Carrots', 'Lettuce', 1);
add('Carrots', 'Marigold', 1);
add('Carrots', 'Marjoram', 1);
add('Carrots', 'Onions', 1);
add('Carrots', 'Parsnip', 0);
add('Carrots', 'Peas', 1);
add('Carrots', 'Radish', 1);
add('Carrots', 'Rosemary', 1);
add('Carrots', 'Rue', 1);
add('Carrots', 'Sage', 1);
add('Carrots', 'Tomato', 1);
add('Cauliflower', 'Celery', 1);
add('Cauliflower', 'Climbing beans', 1);
add('Cauliflower', 'Coriander', 1);
add('Cauliflower', 'Cucumber', 1);
add('Cauliflower', 'Dill', 1);
add('Cauliflower', 'Marigold', 1);
add('Cauliflower', 'Marjoram', 1);
add('Cauliflower', 'Potato', 1);
add('Cauliflower', 'Rue', 0);
add('Cauliflower', 'Strawberries', 0);
add('Cauliflower', 'Tomato', 1);
add('Celery', 'Dill', 1);
add('Celery', 'Leeks', 1);
add('Celery', 'Marjoram', 1);
add('Celery', 'Parsnip', 0);
add('Celery', 'Peas', 1);
add('Celery', 'Potato', 0);
add('Celery', 'Tomato', 1);
add('Cherry', 'Chives', 1);
add('Cherry', 'Garlic', 1);
add('Cherry', 'Horseradish', 1);
add('Cherry', 'Lemon', 1);
add('Cherry', 'Lettuce', 1);
add('Cherry', 'Marigold', 1);
add('Cherry', 'Mustard', 1);
add('Cherry', 'Nasturtiums', 1);
add('Cherry', 'Potato', 0);
add('Cherry', 'Silverbeet', 1);
add('Cherry', 'Spinach', 1);
add('Cherry', 'Tansy', 1);
add('Cherry', 'Yarrow', 1);
add('Chervil', 'Coriander', 1);
add('Chervil', 'Dill', 1);
add('Chervil', 'Garlic', 1);
add('Chervil', 'Lettuce', 1);
add('Chervil', 'Parsley', 1);
add('Chervil', 'Radish', 1);
add('Chervil', 'Yarrow', 1);
add('Chives', 'Climbing beans', 0);
add('Chives', 'Fruit trees', 1);
add('Chives', 'Marjoram', 1);
add('Chives', 'Parsley', 1);
add('Chives', 'Parsnip', 1);
add('Chives', 'Peas', 0);
add('Chives', 'Roses', 1);
add('Chives', 'Strawberries', 1);
add('Chives', 'Tomato', 1);
add('Climbing beans', 'Corn', 1);
add('Climbing beans', 'Garlic', 0);
add('Climbing beans', 'Lettuce', 1);
add('Climbing beans', 'Marjoram', 1);
add('Climbing beans', 'Onions', 0);
add('Climbing beans', 'Radish', 1);
add('Climbing beans', 'Sunflower', 0);
add('Coriander', 'Dill', 1);
add('Coriander', 'Fennel', 0);
add('Coriander', 'Parsnip', 1);
add('Corn', 'Cucumber', 1);
add('Corn', 'Marjoram', 1);
add('Corn', 'Parsnip', 1);
add('Corn', 'Peas', 1);
add('Corn', 'Potato', 1);
add('Corn', 'Pumpkin', 1);
add('Corn', 'Radish', 1);
add('Corn', 'Zucchini', 1);
add('Cucumber', 'Dill', 1);
add('Cucumber', 'Lettuce', 1);
add('Cucumber', 'Marjoram', 1);
add('Cucumber', 'Nasturtiums', 1);
add('Cucumber', 'Peas', 1);
add('Cucumber', 'Potato', 0);
add('Cucumber', 'Radish', 1);
add('Cucumber', 'Sage', 0);
add('Cucumber', 'Sunflower', 1);
add('Cucumber', 'Tansy', 1);
add('Dill', 'Fennel', 1);
add('Dill', 'Tomato', 1);
add('Eggplant', 'Marjoram', 1);
add('Eggplant', 'Potato', 1);
add('Fennel', 'Lavender', 0);
add('Fennel', 'Tomato', 0);
add('Fruit trees', 'Garlic', 1);
add('Fruit trees', 'Lemon', 1);
add('Fruit trees', 'Marigold', 1);
add('Fruit trees', 'Mustard', 1);
add('Fruit trees', 'Nasturtiums', 1);
add('Fruit trees', 'Silverbeet', 1);
add('Fruit trees', 'Spinach', 1);
add('Fruit trees', 'Tansy', 1);
add('Fruit trees', 'Yarrow', 1);
add('Garlic', 'Lavender', 1);
add('Garlic', 'Peas', 0);
add('Garlic', 'Rosemary', 1);
add('Garlic', 'Roses', 1);
add('Garlic', 'Strawberries', 0);
add('Garlic', 'Sunflower', 0);
add('Gooseberry', 'Tomato', 1);
add('Grape vine', 'Mustard', 1);
add('Grape vine', 'Tansy', 1);
add('Grape vine', 'Tomato', 1);
add('Grape vine', 'Yarrow', 1);
add('Horseradish', 'Potato', 1);
add('Horseradish', 'Roses', 1);
add('Lavender', 'Marjoram', 1);
add('Lavender', 'Roses', 1);
add('Lavender', 'Silverbeet', 1);
add('Lavender', 'Strawberries', 1);
add('Leeks', 'Marjoram', 1);
add('Leeks', 'Onions', 1);
add('Lemon', 'Roses', 1);
add('Lettuce', 'Marigold', 1);
add('Lettuce', 'Marjoram', 1);
add('Lettuce', 'Onions', 1);
add('Lettuce', 'Parsley', 0);
add('Lettuce', 'Parsnip', 1);
add('Lettuce', 'Peas', 1);
add('Lettuce', 'Radish', 1);
add('Lettuce', 'Strawberries', 1);
add('Marigold', 'Potato', 1);
add('Marigold', 'Raspberry', 1);
add('Marigold', 'Roses', 1);
add('Marigold', 'Strawberries', 1);
add('Marigold', 'Tomato', 1);
add('Marjoram', 'Onions', 1);
add('Marjoram', 'Parsnip', 1);
add('Marjoram', 'Peas', 1);
add('Marjoram', 'Potato', 1);
add('Marjoram', 'Pumpkin', 1);
add('Marjoram', 'Radish', 1);
add('Marjoram', 'Shallots', 1);
add('Marjoram', 'Silverbeet', 1);
add('Marjoram', 'Spinach', 1);
add('Marjoram', 'Tomato', 1);
add('Marjoram', 'Zucchini', 1);
add('Mints', 'Parsley', 0);
add('Mints', 'Tomato', 1);
add('Nasturtiums', 'Potato', 1);
add('Nasturtiums', 'Radish', 1);
add('Nasturtiums', 'Roses', 1);
add('Nasturtiums', 'Strawberries', 1);
add('Nasturtiums', 'Tomato', 1);
add('Nasturtiums', 'Zucchini', 1);
add('Onions', 'Parsley', 1);
add('Onions', 'Parsnip', 1);
add('Onions', 'Peas', 0);
add('Onions', 'Roses', 1);
add('Onions', 'Savoy', 1);
add('Onions', 'Silverbeet', 1);
add('Onions', 'Strawberries', 1);
add('Onions', 'Tomato', 1);
add('Parsley', 'Rosemary', 1);
add('Parsley', 'Roses', 1);
add('Parsley', 'Tomato', 1);
add('Parsnip', 'Peas', 1);
add('Parsnip', 'Potato', 1);
add('Parsnip', 'Radish', 1);
add('Parsnip', 'Sage', 1);
add('Parsnip', 'Tomato', 1);
add('Peas', 'Potato', 1);
add('Peas', 'Raspberry', 1);
add('Peas', 'Savoy', 1);
add('Peas', 'Shallots', 0);
add('Potato', 'Pumpkin', 0);
add('Potato', 'Raspberry', 0);
add('Potato', 'Rosemary', 1);
add('Potato', 'Sunflower', 0);
add('Potato', 'Tomato', 0);
add('Raspberry', 'Rue', 1);
add('Rosemary', 'Sage', 0);
add('Rosemary', 'Savoy', 1);
add('Rosemary', 'Tomato', 1);
add('Roses', 'Rue', 1);
add('Roses', 'Sage', 1);
add('Roses', 'Savoy', 1);
add('Roses', 'Tansy', 1);
add('Roses', 'Thyme', 1);
add('Rue', 'Sage', 0);
add('Rue', 'Savoy', 0);
add('Sage', 'Strawberries', 1);
add('Savoy', 'Strawberries', 1);
add('Spinach', 'Strawberries', 1);
add('Tansy', 'Yarrow', 1);

module.exports = {
	plants,
	companions,
	getCompanionValue
};
