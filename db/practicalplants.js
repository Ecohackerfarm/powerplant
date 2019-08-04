/**
 * Support code for the crop database exported from practicalplants.org wiki.
 *
 * @namespace practicalplants
 * @memberof db
 */

const readline = require('readline');
const fs = require('fs');
const shared = require('../shared/practicalplants.js');
const utils = require('../shared/utils.js');

/**
 * @typedef {Object} Crop
 * @property {String} binomialName Binomial name. This exists for each crop.
 * @property {String} commonName Common name. May not exist for each crop.
 * @property {Boolean} poorNutrition
 * @property {Number} hardinessZone TODO define range
 * @property {Array} soilTexture TODO define enum values
 * @property {Array} soilPh TODO define enum values
 * @property {Array} soilWaterRetention TODO define enum values
 * @property {Array} shade TODO define enum values
 * @property {Array} sun TODO define enum values
 * @property {Array} water TODO define enum values
 * @property {Array} drought TODO define enum values
 * @property {Array} ecosystemNiche TODO define enum values
 * @property {Array} lifeCycle TODO define enum values
 * @property {String} herbaceousOrWoody
 * @property {String} deciduousOrEvergreen
 * @property {String} growthRate
 * @property {String} matureMeasurementUnit TODO remove from processed output
 * @property {Number} matureHeight TODO convert always to meters
 * @property {Number} matureWidth TODO convert always to meters
 * @property {String} flowerType
 * @property {Array} pollinators TODO define enum values
 * @property {Boolean} wind Wind resistant
 * @property {Boolean} maritime Maritime resistant
 * @property {Boolean} pollution Pollution resistant
 * @property {Array} functions TODO define enum values
 * @property {String} growFrom
 * @property {String} cuttingType
 * @property {String} fertility
 * @property {String} rootZone
 */

/**
 * Read the mongoexport file and normalize its contents to ease
 * processing.
 *
 * @return {Crop[]} Crop objects
 */
function readCrops() {
  return readCropsLower().map(inputObject => {
    /*
     * Select properties that are useful for powerplant. Nulls or empty
     * arrays are used for missing values in normalized objects.
     */
    const object = {};
    Object.values(PP_MAPPINGS).forEach(property => {
      if (
        !(property in inputObject) ||
        [undefined, null, '', '\n'].includes(inputObject[property])
      ) {
        object[property] = ARRAY_PROPERTIES.includes(property) ? [] : null;
      } else {
        object[property] = inputObject[property];
      }
    });

    /*
     * Parse objects to strings.
     */
    if (!Array.isArray(object['functions'])) {
      object['functions'] = object['functions']['function'];
    }

    /*
     * Convert numeric properties from strings to actual numbers.
     *
     * TODO Sometimes the value is given as a range ("1.5 - 3"),
     * take average in such cases?
     */
    NUMBER_PROPERTIES.forEach(property => {
      object[property] = object[property] ? parseFloat(object[property]) : null;
    });

    /*
     * Values of these properties are sometimes arrays and
     * sometimes CSV strings. Normalize all of them to arrays.
     *
     * TODO Where does this come from? From original
     * practicalplants.org data, mediawiki_scraper, or the
     * code here?
     */
    ARRAY_PROPERTIES.forEach(property => convertToArray(object, property));

    /*
     * Normalize values.
     */
    BOOLEAN_PROPERTIES.forEach(property => {
      replaceValue(object, property, ['No', 'False'], 'false');
      replaceValue(object, property, ['Yes', 'True'], 'true');
    });

    replaceValue(object, 'matureMeasurementUnit', ['metres'], 'meters');

    replaceArrayValue(object['pollinators'], ['bees. self'], ['bees', 'self']);
    replaceArrayValue(object['pollinators'], ['hover-flies'], ['hoverflies']);
    replaceArrayValue(
      object['pollinators'],
      ['apomyctic', 'apomixy'],
      ['apomictic']
    );
    replaceArrayValue(
      object['pollinators'],
      ['cleistogomous', 'cleistogomy', 'cleistogamy'],
      ['cleistogamous']
    );
    replaceArrayValue(
      object['pollinators'],
      ['flies and small bees'],
      ['flies', 'bees']
    );
    replaceArrayValue(
      object['pollinators'],
      ['bees. lepidoptera'],
      ['bees', 'lepidoptera']
    );
    replaceArrayValue(object['pollinators'], ['lepdioptera'], ['lepidoptera']);
    replaceArrayValue(object['pollinators'], ['humble bees'], ['bumblebees']);
    replaceArrayValue(
      object['pollinators'],
      ['flies lepidoptera'],
      ['flies', 'lepidoptera']
    );
    replaceArrayValue(
      object['pollinators'],
      ['self. occasionally flies'],
      ['flies', 'self']
    );
    replaceArrayValue(
      object['pollinators'],
      ['self. occasionally bees'],
      ['bees', 'self']
    );
    replaceArrayValue(
      object['pollinators'],
      ['insects? self'],
      ['insects', 'self']
    );
    replaceArrayValue(object['pollinators'], ['self?'], ['self']);
    replaceArrayValue(object['pollinators'], ['insect'], ['insects']);

    replaceArrayValue(
      object['functions'],
      ['biogenic decalcifier/pioneer species'],
      ['biogenic decalcifier', 'pioneer']
    );
    replaceArrayValue(object['functions'], [''], []);

    PP_PROPERTIES.forEach(property => {
      if (
        object[property] &&
        !NUMBER_PROPERTIES.concat(
          ARRAY_PROPERTIES,
          BOOLEAN_PROPERTIES,
          NAME_PROPERTIES
        ).includes(property)
      ) {
        object[property] = object[property].toLowerCase();
      }
    });

    return object;
  });
}

function replaceArrayValue(array, from, to) {
  from.forEach(fromValue => {
    let index;
    while ((index = array.findIndex(value => value == fromValue)) >= 0) {
      array.splice(index, 1, ...to);
    }
  });
}

function replaceValue(object, property, from, to) {
  from.forEach(fromValue => {
    if (object[property] == fromValue) {
      object[property] = to;
    }
  });
}

function convertToArray(object, property) {
  object[property] = getAsArray(object[property]).map(value =>
    value.toLowerCase()
  );
  object[property] = object[property].filter(
    value => count(object[property], value) == 1
  );
}

function count(array, match) {
  let counter = 0;
  array.forEach(value => {
    if (value == match) {
      counter++;
    }
  });
  return counter;
}

function getAsArray(value) {
  return typeof value === 'object' ? value : parseCsvLine(value);
}

function parseCsvLine(line) {
  return line.split(',').map(value => value.trim());
}

/**
 * Read the whole mongoexport file to an array of crop objects.
 *
 * @return {Array} Crop objects
 */
function readCropsLower() {
  const lines = fs
    .readFileSync(__dirname + '/practicalplants.json', { encoding: 'latin1' })
    .split('\n');
  const crops = lines.splice(0, lines.length - 1).map(line => JSON.parse(line));

  /*
   * Rename property names to camelCase.
   */
  crops.forEach(crop => {
    Object.keys(PP_MAPPINGS).forEach(property => {
      const renamedProperty = PP_MAPPINGS[property];
      if (renamedProperty != property && crop[property] !== undefined) {
        crop[renamedProperty] = crop[property];
        delete crop[property];
      }
    });
  });

  return crops;
}

/*
 * All possible properties that may appear in raw practicalplants.org data.
 */
const ALL_PROPERTIES = [
  '_id',
  'append to article summary',
  'article summary',
  'primary image',
  'binomial',
  'genus',
  'family',
  'life cycle',
  'herbaceous or woody',
  'deciduous or evergreen',
  'flower type',
  'growth rate',
  'mature height',
  'mature width',
  'sun',
  'shade',
  'hardiness zone',
  'water',
  'drought',
  'soil texture',
  'soil ph',
  'wind',
  'maritime',
  'pollution',
  'poornutrition',
  'edible part and use', // TODO Appears in practicalplants.org MediaWiki API but missing in our data.
  'material use notes',
  'PFAF material use notes',
  'material part and use', // TODO Appears in practicalplants.org MediaWiki API but missing in our data.
  'medicinal part and use', // TODO Appears in practicalplants.org MediaWiki API but missing in our data.
  'toxic parts', // TODO Looks useful, special format
  'functions',
  'shelter', // TODO Looks useful, little used, special format
  'forage', // TODO Looks useful, little used, special format
  'propagation notes',
  'PFAF propagation notes',
  'seed requires stratification',
  'seed dormancy depth', // TODO Looks useful, little used
  'seed requires scarification', // TODO Looks useful, little used
  'seed requires smokification', // TODO Looks useful, little used
  'rootstocks',
  'cultivation notes',
  'PFAF cultivation notes',
  'crops', // TODO Looks useful, little used, special format
  'interactions',
  'botanical references',
  'material uses references',
  'range',
  'habitat', // TODO Maybe information could be parsed from the free-form text.
  'enabled',
  'title irregular',
  'common',
  'soil water retention',
  'medicinal use notes',
  'toxicity notes',
  'grow from',
  'germination details',
  'cultivation',
  'edible uses references',
  'medicinal uses references',
  'mature measurement unit',
  'pollinators',
  'edible use notes',
  'PFAF edible use notes',
  'PFAF medicinal use notes',
  'override summary',
  'ecosystem niche',
  'problems',
  'PFAF toxicity notes',
  'infraspecific epithet',
  'cultivar of groups',
  'cultivar epithet',
  'cultivar group epithet',
  'life references',
  'subspecies',
  'subspecies',
  'cultivar groups',
  'cutting type',
  'cutting details',
  'problem notes',
  'salinity', // TODO Looks useful, little used
  'fertility',
  'propagation',
  'common use description',
  'flower colour',
  'common habit description',
  'ungrouped cultivars',
  'functions notes',
  'botanical description',
  'crop notes',
  'classification references',
  'environmental references',
  'native range',
  'native environment', // TODO Looks useful, little used, free-formish
  'ecosystems references',
  'uses intro',
  'seed saving details',
  'root zone',
  'taxonomic rank',
  'functions as', // TODO Duplicate with 'functions', these should probably be combined?
  'shelter notes',
  'forage notes',
  'material uses', // TODO Looks useful, little used
  'heat zone', // TODO Looks useful, little used
  'bulb type', // TODO Looks useful, little used
  'graft rootstock', // TODO Looks useful, little used
  'edible parts', // TODO Looks useful, little used
  'edible uses', // TODO Looks useful, little used
  'show cultivar group',
  'cultivar group',
  'is a variety',
  'variety type',
  'cultivar name',
  'cultivar of',
  'variety name',
  'variety of',
  'subspecies name',
  'subspecies of',
  'summary',
  'cultivar group of',
  'seed stratification instructions',
  'graft details',
  'bulb details',
  'subspecific epithet',
  'cultivar notes',
  ''
];

function toCamelCase(property) {
  return { [property]: utils.toCamelCase(property) };
}

const PP_MAPPINGS = {
  binomial: 'binomialName',
  common: 'commonName',
  poornutrition: 'poorNutrition',
  ...toCamelCase('hardiness zone'),
  ...toCamelCase('soil texture'),
  ...toCamelCase('soil ph'),
  ...toCamelCase('soil water retention'),
  ...toCamelCase('shade'),
  ...toCamelCase('sun'),
  ...toCamelCase('water'),
  ...toCamelCase('drought'),
  ...toCamelCase('ecosystem niche'),
  ...toCamelCase('life cycle'),
  ...toCamelCase('herbaceous or woody'),
  ...toCamelCase('deciduous or evergreen'),
  ...toCamelCase('growth rate'),
  ...toCamelCase('mature measurement unit'),
  ...toCamelCase('mature height'),
  ...toCamelCase('mature width'),
  ...toCamelCase('flower type'),
  ...toCamelCase('pollinators'),
  ...toCamelCase('wind'),
  ...toCamelCase('maritime'),
  ...toCamelCase('pollution'),
  ...toCamelCase('functions'),
  ...toCamelCase('grow from'),
  ...toCamelCase('cutting type'),
  ...toCamelCase('fertility'),
  ...toCamelCase('root zone')
};

/*
 * Subset of ALL_PROPERTIES that are currently used by powerplant.
 */
const PP_PROPERTIES = Object.values(PP_MAPPINGS);

/*
 * Subset of PP_PROPERTIES that have boolean values.
 */
const BOOLEAN_PROPERTIES = ['poorNutrition', 'wind', 'maritime', 'pollution'];

/*
 * Subset of PP_PROPERTIES that have numeric values.
 */
const NUMBER_PROPERTIES = ['hardinessZone', 'matureHeight', 'matureWidth'];

/*
 * Subset of PP_PROPERTIES that have array values.
 */
const ARRAY_PROPERTIES = [
  'soilTexture',
  'soilPh',
  'soilWaterRetention',
  'ecosystemNiche',
  'lifeCycle',
  'pollinators',
  'growFrom',
  'cuttingType',
  'fertility',
  'functions'
];

/*
 * Subset of PP_PROPERTIES that have any kind of names for the crop.
 */
const NAME_PROPERTIES = ['binomialName', 'commonName'];

/*
 * Values that appear in raw practicalplants.org data, and the corresponding
 * normalized values.
 */
const ALL_BOOLEAN_VALUES = ['No', 'False', 'Yes', 'True'];
const PP_BOOLEAN_VALUES = shared.PP_BOOLEAN_VALUES;

const ALL_HARDINESS_ZONE_VALUES = 12;
const PP_HARDINESS_ZONE_VALUES = shared.PP_HARDINESS_ZONE_VALUES;

const ALL_SOIL_TEXTURE_VALUES = ['sandy', 'loamy', 'clay', 'heavy clay'];
const PP_SOIL_TEXTURE_VALUES = shared.PP_SOIL_TEXTURE_VALUES;

const ALL_SOIL_PH_VALUES = [
  'very acid',
  'acid',
  'neutral',
  'alkaline',
  'very alkaline'
];
const PP_SOIL_PH_VALUES = shared.PP_SOIL_PH_VALUES;

const ALL_SOIL_WATER_RETENTION_VALUES = ['well drained', 'moist', 'wet'];
const PP_SOIL_WATER_RETENTION_VALUES = shared.PP_SOIL_WATER_RETENTION_VALUES;

const ALL_SHADE_VALUES = [
  'no shade',
  'light shade',
  'partial shade',
  'permanent shade',
  'permanent deep shade'
];
const PP_SHADE_VALUES = shared.PP_SHADE_VALUES;

const ALL_SUN_VALUES = ['indirect sun', 'partial sun', 'full sun'];
const PP_SUN_VALUES = shared.PP_SUN_VALUES;

const ALL_WATER_VALUES = ['low', 'moderate', 'high', 'aquatic'];
const PP_WATER_VALUES = shared.PP_WATER_VALUES;

const ALL_DROUGHT_VALUES = ['dependent', 'tolerant', 'intolerant'];
const PP_DROUGHT_VALUES = shared.PP_DROUGHT_VALUES;

const ALL_ECOSYSTEM_NICHE_VALUES = [
  'Canopy',
  'Climber',
  'Secondary canopy',
  'Soil surface',
  'Climber',
  'Shrub',
  'Herbaceous',
  'Rhizosphere'
];
const PP_ECOSYSTEM_NICHE_VALUES = shared.PP_ECOSYSTEM_NICHE_VALUES;

const ALL_LIFE_CYCLE_VALUES = ['perennial', 'annual', 'biennial'];
const PP_LIFE_CYCLE_VALUES = shared.PP_LIFE_CYCLE_VALUES;

const ALL_HERBACEOUS_OR_WOODY_VALUES = ['herbaceous', 'woody', ''];
const PP_HERBACEOUS_OR_WOODY_VALUES = shared.PP_HERBACEOUS_OR_WOODY_VALUES;

const ALL_DECIDUOUS_OR_EVERGREEN_VALUES = ['deciduous', 'evergreen', ''];
const PP_DECIDUOUS_OR_EVERGREEN_VALUES =
  shared.PP_DECIDUOUS_OR_EVERGREEN_VALUES;

const ALL_GROWTH_RATE_VALUES = ['slow', 'moderate', 'vigorous'];
const PP_GROWTH_RATE_VALUES = shared.PP_GROWTH_RATE_VALUES;

const ALL_MATURE_MEASUREMENT_UNIT_VALUES = ['meters', 'metres', 'feet'];
const PP_MATURE_MEASUREMENT_UNIT_VALUES =
  shared.PP_MATURE_MEASUREMENT_UNIT_VALUES;

const ALL_MATURE_HEIGHT_VALUES = 110;
const PP_MATURE_HEIGHT_VALUES = shared.PP_MATURE_HEIGHT_VALUES;

const ALL_MATURE_WIDTH_VALUES = 30;
const PP_MATURE_WIDTH_VALUES = shared.PP_MATURE_WIDTH_VALUES;

const ALL_FLOWER_TYPE_VALUES = ['hermaphrodite', 'monoecious', 'dioecious'];
const PP_FLOWER_TYPE_VALUES = shared.PP_FLOWER_TYPE_VALUES;

const ALL_POLLINATORS_VALUES = [
  'Insects',
  'Wind',
  'Bees',
  'Flies',
  'Self',
  'Beetles',
  'Lepidoptera',
  'Bats',
  'Moths',
  'insects',
  'wind',
  'lepidoptera',
  'birds',
  'Apomictic',
  'Bees. self',
  'Apomyctic',
  'Slugs',
  'Snails',
  'Hover-flies',
  'Cleistogamous',
  'Wasps',
  'Water',
  'Midges',
  'Birds',
  'Flies and small bees',
  'Bees. lepidoptera',
  'Diptera',
  'Cleistogomous',
  'Butterflies',
  'Hoverflies',
  'Lepdioptera',
  'Apomixy',
  'Bumblebees',
  'Insect',
  'Humble bees',
  'Cleistogamy',
  'Wind-blown sand',
  'Flies lepidoptera',
  'Cleistogomy',
  'Self. Occasionally flies',
  'Insects? Self',
  'Sunbirds',
  'Self. Occasionally bees',
  'Carrion flies',
  'Self?',
  'Hand',
  'Dryoptera',
  'Hymenoptera'
];
const PP_POLLINATORS_VALUES = shared.PP_POLLINATORS_VALUES;

const ALL_FUNCTIONS_VALUES = [
  'Nitrogen fixer',
  'Ground cover',
  'Hedge',
  'Windbreak',
  'Pioneer',
  'Nitrogen Fixer',
  'Earth stabiliser',
  'Green manure',
  'Repellant',
  'Soil builder',
  'Rootstock',
  'Biogenic Decalcifier/Pioneer Species',
  'Phytoremediation',
  'Bee attractor',
  'Soil conditioner',
  'Pest Repellent'
];
const PP_FUNCTIONS_VALUES = shared.PP_FUNCTIONS_VALUES;

const ALL_GROW_FROM_VALUES = [
  'seed',
  'cutting',
  'layering',
  'tuber',
  'suckers',
  'graft',
  'bulb'
];
const PP_GROW_FROM_VALUES = shared.PP_GROW_FROM_VALUES;

const ALL_CUTTING_TYPE_VALUES = [
  'semi-ripe',
  'soft wood',
  'root',
  'hard wood',
  ''
];
const PP_CUTTING_TYPE_VALUES = shared.PP_CUTTING_TYPE_VALUES;

const ALL_FERTILITY_VALUES = ['self fertile', 'self sterile'];
const PP_FERTILITY_VALUES = shared.PP_FERTILITY_VALUES;

const ALL_ROOT_ZONE_VALUES = ['shallow', 'deep', 'surface'];
const PP_ROOT_ZONE_VALUES = shared.PP_ROOT_ZONE_VALUES;

module.exports = {
  readCrops,
  readCropsLower,

  getAsArray,

  ALL_PROPERTIES,
  PP_PROPERTIES,
  NUMBER_PROPERTIES,
  ARRAY_PROPERTIES,

  ALL_BOOLEAN_VALUES,
  ALL_HARDINESS_ZONE_VALUES,
  ALL_SOIL_TEXTURE_VALUES,
  ALL_SOIL_PH_VALUES,
  ALL_SOIL_WATER_RETENTION_VALUES,
  ALL_SHADE_VALUES,
  ALL_SUN_VALUES,
  ALL_WATER_VALUES,
  ALL_DROUGHT_VALUES,
  ALL_ECOSYSTEM_NICHE_VALUES,
  ALL_LIFE_CYCLE_VALUES,
  ALL_HERBACEOUS_OR_WOODY_VALUES,
  ALL_DECIDUOUS_OR_EVERGREEN_VALUES,
  ALL_GROWTH_RATE_VALUES,
  ALL_MATURE_MEASUREMENT_UNIT_VALUES,
  ALL_MATURE_HEIGHT_VALUES,
  ALL_MATURE_WIDTH_VALUES,
  ALL_FLOWER_TYPE_VALUES,
  ALL_POLLINATORS_VALUES,
  ALL_FUNCTIONS_VALUES,
  ALL_GROW_FROM_VALUES,
  ALL_CUTTING_TYPE_VALUES,
  ALL_FERTILITY_VALUES,
  ALL_ROOT_ZONE_VALUES,

  PP_BOOLEAN_VALUES,
  PP_HARDINESS_ZONE_VALUES,
  PP_SOIL_TEXTURE_VALUES,
  PP_SOIL_PH_VALUES,
  PP_SOIL_WATER_RETENTION_VALUES,
  PP_SHADE_VALUES,
  PP_SUN_VALUES,
  PP_WATER_VALUES,
  PP_DROUGHT_VALUES,
  PP_ECOSYSTEM_NICHE_VALUES,
  PP_LIFE_CYCLE_VALUES,
  PP_HERBACEOUS_OR_WOODY_VALUES,
  PP_DECIDUOUS_OR_EVERGREEN_VALUES,
  PP_GROWTH_RATE_VALUES,
  PP_MATURE_MEASUREMENT_UNIT_VALUES,
  PP_MATURE_HEIGHT_VALUES,
  PP_MATURE_WIDTH_VALUES,
  PP_FLOWER_TYPE_VALUES,
  PP_POLLINATORS_VALUES,
  PP_FUNCTIONS_VALUES,
  PP_GROW_FROM_VALUES,
  PP_CUTTING_TYPE_VALUES,
  PP_FERTILITY_VALUES,
  PP_ROOT_ZONE_VALUES
};
