const { assert } = require('chai');
const PracticalplantsCrop = require('../../shared/practicalplants-crop.js');
const Crop = require('../../shared/crop.js');
const utils = require('../../shared/utils.js');

describe('practicalplants.json', () => {
  function updateMissingCount(missingCounts, object, property, allowedValues) {
    if (
      !(property in object) ||
      (isFunctionsPropertyOfUnnormalizedObject(property, allowedValues) &&
        object[property]['function'] === undefined)
    ) {
      if (!(property in missingCounts)) {
        missingCounts[property] = 0;
      }
      missingCounts[property]++;
      return false;
    }
    return true;
  }

  function assertValueOrMissing(object, property, allowedValues) {
    const value = object[property];
    if (!(value === null || (Array.isArray(value) && value.length === 0))) {
      assertValue(object, property, allowedValues);
    }
  }

  function assertValue(object, property, allowedValues) {
    if (Crop.ARRAY_PROPERTIES.includes(property)) {
      const array = isFunctionsPropertyOfUnnormalizedObject(
        property,
        allowedValues
      )
        ? object[property]['function']
        : object[property];
      assert.isTrue(
        PracticalplantsCrop.getAsArray(array).every(value =>
          allowedValues.includes(value)
        ),
        JSON.stringify(array)
      );
    } else if (Crop.NUMBER_PROPERTIES.includes(property)) {
      const value = parseFloat(object[property]);
      assert.isTrue(value >= 0);
      assert.isTrue(value <= allowedValues);
    } else {
      const value = object[property];
      assert.isTrue(allowedValues.includes(value), value);
    }
  }

  function isFunctionsPropertyOfUnnormalizedObject(property, allowedValues) {
    return (
      property == 'functions' &&
      allowedValues === PracticalplantsCrop.FUNCTIONS_VALUES
    );
  }

  function assertArrayPropertyOfRangeHasAllValuesInBetween(
    arrayValue,
    allValues
  ) {
    const indices = arrayValue.map(value =>
      allValues.findIndex(temp => temp == value)
    );
    indices.sort((a, b) => a - b);
    return indices.every(
      (value, index) =>
        index == indices.length || value + 1 == indices[index + 1]
    );
  }

  function assertNoDuplicates(values) {
    assert.isTrue(
      values.every(value => values.indexOf(value) == values.lastIndexOf(value))
    );
  }

  function assertNamedPropertyStartsWithUpperCase(object) {
    for (const property of Crop.NAME_PROPERTIES) {
      if (object[property]) {
        assert.isTrue(/[a-zA-Z]/.test(object[property][0]), object[property]);
        assert.isTrue(
          object[property][0] === object[property][0].toUpperCase(),
          object[property]
        );
      }
    }
  }

  /**
   * @param {PracticalplantsCrop[]} crops
   * @param {String} property
   * @param {String[]} expectedSet
   */
  function assertObjectArrayElementPropertySet(crops, property, expectedSet) {
    const properties = new Set();
    crops.forEach(crop => {
      if (!PracticalplantsCrop.isUndefined(crop, property)) {
        crop[property].forEach(element => {
          utils.addAllToSet(properties, Object.keys(element));
        });
      }
    });
    assertSetAndArrayEqual(properties, expectedSet);
  }

  /**
   * @param {Object} setObject
   * @param {Object[]} array
   */
  function assertSetAndArrayEqual(setObject, array) {
    assert.isTrue(utils.areSetsEqual(setObject, new Set(array)));
  }

  /**
   * @param {Object[]} crops
   * @param {String} property
   */
  function assertPropertyIsString(crops, property) {
    assert.isTrue(PracticalplantsCrop.PROPERTIES.includes(property));
    assert.isTrue(!PracticalplantsCrop.ARRAY_PROPERTIES.includes(property));
    crops.forEach(crop => {
      const value = crop[property];
      if (value) {
        assert.equal(typeof value, 'string');
      }
    });
  }

  /**
   * Some parsers try to parse CSV-strings to arrays, sometimes returning an array
   * and sometimes a string. We are fine with both representations.
   *
   * @param {Object[]} crops
   * @param {String} property
   */
  function assertPropertyIsArrayOrString(crops, property) {
    assert.isTrue(PracticalplantsCrop.PROPERTIES.includes(property));
    assert.isTrue(PracticalplantsCrop.ARRAY_PROPERTIES.includes(property));
    crops.forEach(crop => {
      assertValueIsArrayOrString(crop[property]);
    });
  }

  /**
   * @param {Object} value
   */
  function assertValueIsArrayOrString(value) {
    if (value) {
      assert.isTrue(typeof value === 'string' || Array.isArray(value));
    }
  }

  let practicalplantsCrops;
  let crops;

  before(() => {
    practicalplantsCrops = require('../../db/practicalplants-data.js');
    crops = PracticalplantsCrop.convertToCrops(practicalplantsCrops);
  });

  it('is array of objects', () => {
    assert.isTrue(Array.isArray(practicalplantsCrops));
    practicalplantsCrops.forEach(crop => {
      assert.isNotNull(crop);
      assert.equal(typeof crop, 'object');
    });
  });

  it('number of crops', () => {
    assert.equal(practicalplantsCrops.length, 7416);
  });

  it('set of properties', () => {
    const properties = new Set();
    practicalplantsCrops.forEach(crop => {
      utils.addAllToSet(properties, Object.keys(crop));
    });
    assertSetAndArrayEqual(properties, PracticalplantsCrop.PROPERTIES);
  });

  it('properties are either strings or arrays of objects', () => {
    assertPropertyIsString(practicalplantsCrops, 'append to article summary');
    assertPropertyIsString(practicalplantsCrops, 'article summary');
    assertPropertyIsString(practicalplantsCrops, 'primary image');
    assertPropertyIsString(practicalplantsCrops, 'binomial');
    assertPropertyIsString(practicalplantsCrops, 'genus');
    assertPropertyIsString(practicalplantsCrops, 'family');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'life cycle');
    assertPropertyIsString(practicalplantsCrops, 'herbaceous or woody');
    assertPropertyIsString(practicalplantsCrops, 'deciduous or evergreen');
    assertPropertyIsString(practicalplantsCrops, 'flower type');
    assertPropertyIsString(practicalplantsCrops, 'growth rate');
    assertPropertyIsString(practicalplantsCrops, 'mature height');
    assertPropertyIsString(practicalplantsCrops, 'mature width');
    assertPropertyIsString(practicalplantsCrops, 'sun');
    assertPropertyIsString(practicalplantsCrops, 'shade');
    assertPropertyIsString(practicalplantsCrops, 'hardiness zone');
    assertPropertyIsString(practicalplantsCrops, 'water');
    assertPropertyIsString(practicalplantsCrops, 'drought');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'soil texture');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'soil ph');
    assertPropertyIsString(practicalplantsCrops, 'wind');
    assertPropertyIsString(practicalplantsCrops, 'maritime');
    assertPropertyIsString(practicalplantsCrops, 'pollution');
    assertPropertyIsString(practicalplantsCrops, 'poornutrition');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'edible part and use');
    assertPropertyIsString(practicalplantsCrops, 'material use notes');
    assertPropertyIsString(practicalplantsCrops, 'PFAF material use notes');
    assertPropertyIsArrayOrString(
      practicalplantsCrops,
      'material part and use'
    );
    assertPropertyIsArrayOrString(
      practicalplantsCrops,
      'medicinal part and use'
    );
    assertPropertyIsArrayOrString(practicalplantsCrops, 'toxic parts');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'functions');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'shelter');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'forage');
    assertPropertyIsString(practicalplantsCrops, 'propagation notes');
    assertPropertyIsString(practicalplantsCrops, 'PFAF propagation notes');
    assertPropertyIsString(
      practicalplantsCrops,
      'seed requires stratification'
    );
    assertPropertyIsString(practicalplantsCrops, 'seed dormancy depth');
    assertPropertyIsString(practicalplantsCrops, 'seed requires scarification');
    assertPropertyIsString(practicalplantsCrops, 'seed requires smokification');
    assertPropertyIsString(practicalplantsCrops, 'rootstocks');
    assertPropertyIsString(practicalplantsCrops, 'cultivation notes');
    assertPropertyIsString(practicalplantsCrops, 'PFAF cultivation notes');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'crops');
    assertPropertyIsString(practicalplantsCrops, 'interactions');
    assertPropertyIsString(practicalplantsCrops, 'botanical references');
    assertPropertyIsString(practicalplantsCrops, 'material uses references');
    assertPropertyIsString(practicalplantsCrops, 'range');
    assertPropertyIsString(practicalplantsCrops, 'habitat');
    assertPropertyIsString(practicalplantsCrops, 'enabled');
    assertPropertyIsString(practicalplantsCrops, 'title irregular');
    assertPropertyIsString(practicalplantsCrops, 'common');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'soil water retention');
    assertPropertyIsString(practicalplantsCrops, 'medicinal use notes');
    assertPropertyIsString(practicalplantsCrops, 'toxicity notes');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'grow from');
    assertPropertyIsString(practicalplantsCrops, 'germination details');
    assertPropertyIsString(practicalplantsCrops, 'cultivation');
    assertPropertyIsString(practicalplantsCrops, 'edible uses references');
    assertPropertyIsString(practicalplantsCrops, 'medicinal uses references');
    assertPropertyIsString(practicalplantsCrops, 'mature measurement unit');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'pollinators');
    assertPropertyIsString(practicalplantsCrops, 'edible use notes');
    assertPropertyIsString(practicalplantsCrops, 'PFAF edible use notes');
    assertPropertyIsString(practicalplantsCrops, 'PFAF medicinal use notes');
    assertPropertyIsString(practicalplantsCrops, 'override summary');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'ecosystem niche');
    assertPropertyIsString(practicalplantsCrops, 'problems');
    assertPropertyIsString(practicalplantsCrops, 'infraspecific epithet');
    assertPropertyIsString(practicalplantsCrops, 'cultivar of groups');
    assertPropertyIsString(practicalplantsCrops, 'cultivar epithet');
    assertPropertyIsString(practicalplantsCrops, 'cultivar group epithet');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'life references');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'subspecies');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'cultivar groups');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'cutting type');
    assertPropertyIsString(practicalplantsCrops, 'cutting details');
    assertPropertyIsString(practicalplantsCrops, 'problem notes');
    assertPropertyIsString(practicalplantsCrops, 'salinity');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'fertility');
    assertPropertyIsString(practicalplantsCrops, 'propagation');
    assertPropertyIsString(practicalplantsCrops, 'common use description');
    assertPropertyIsString(practicalplantsCrops, 'flower colour');
    assertPropertyIsString(practicalplantsCrops, 'common habit description');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'ungrouped cultivars');
    assertPropertyIsString(practicalplantsCrops, 'functions notes');
    assertPropertyIsString(practicalplantsCrops, 'botanical description');
    assertPropertyIsString(practicalplantsCrops, 'crop notes');
    assertPropertyIsString(practicalplantsCrops, 'classification references');
    assertPropertyIsArrayOrString(
      practicalplantsCrops,
      'environmental references'
    );
    assertPropertyIsArrayOrString(practicalplantsCrops, 'native range');
    assertPropertyIsString(practicalplantsCrops, 'native environment');
    assertPropertyIsString(practicalplantsCrops, 'ecosystems references');
    assertPropertyIsString(practicalplantsCrops, 'uses intro');
    assertPropertyIsString(practicalplantsCrops, 'seed saving details');
    assertPropertyIsString(practicalplantsCrops, 'root zone');
    assertPropertyIsString(practicalplantsCrops, 'taxonomic rank');
    assertPropertyIsArrayOrString(practicalplantsCrops, 'functions as');
    assertPropertyIsString(practicalplantsCrops, 'shelter notes');
    assertPropertyIsString(practicalplantsCrops, 'forage notes');
    assertPropertyIsString(practicalplantsCrops, 'material uses');
    assertPropertyIsString(practicalplantsCrops, 'heat zone');
    assertPropertyIsString(practicalplantsCrops, 'bulb type');
    assertPropertyIsString(practicalplantsCrops, 'graft rootstock');
    assertPropertyIsString(practicalplantsCrops, 'edible parts');
    assertPropertyIsString(practicalplantsCrops, 'edible uses');
    assertPropertyIsString(practicalplantsCrops, 'show cultivar group');
    assertPropertyIsString(practicalplantsCrops, 'cultivar group');
    assertPropertyIsString(practicalplantsCrops, 'is a variety');
    assertPropertyIsString(practicalplantsCrops, 'variety type');
    assertPropertyIsString(practicalplantsCrops, 'cultivar name');
    assertPropertyIsString(practicalplantsCrops, 'cultivar of');
    assertPropertyIsString(practicalplantsCrops, 'variety name');
    assertPropertyIsString(practicalplantsCrops, 'variety of');
    assertPropertyIsString(practicalplantsCrops, 'subspecies name');
    assertPropertyIsString(practicalplantsCrops, 'subspecies of');
    assertPropertyIsString(practicalplantsCrops, 'summary');
    assertPropertyIsString(practicalplantsCrops, 'cultivar group of');
    assertPropertyIsString(
      practicalplantsCrops,
      'seed stratification instructions'
    );
    assertPropertyIsString(practicalplantsCrops, 'graft details');
    assertPropertyIsString(practicalplantsCrops, 'bulb details');
    assertPropertyIsString(practicalplantsCrops, 'subspecific epithet');
    assertPropertyIsString(practicalplantsCrops, 'cultivar notes');
  });

  it('object array element properties are always strings', () => {
    practicalplantsCrops.forEach(crop => {
      PracticalplantsCrop.OBJECT_ARRAY_PROPERTIES.forEach(property => {
        if (!PracticalplantsCrop.isUndefined(crop, property)) {
          crop[property].forEach(element =>
            Object.keys(element).forEach(elementProperty => {
              assertValueIsArrayOrString(element[elementProperty]);
            })
          );
        }
      });
    });
  });

  it('sets of properties of object array elements', () => {
    assertObjectArrayElementPropertySet(
      practicalplantsCrops,
      'edible part and use',
      ['part used', 'preparation', 'part used for', 'part use details']
    );
    assertObjectArrayElementPropertySet(
      practicalplantsCrops,
      'medicinal part and use',
      ['part used', 'preparation', 'part used for', 'part use details']
    );
    assertObjectArrayElementPropertySet(
      practicalplantsCrops,
      'material part and use',
      ['part used', 'preparation', 'part used for', 'part use details']
    );
    assertObjectArrayElementPropertySet(practicalplantsCrops, 'toxic parts', [
      'part',
      'level',
      'details',
      'compounds'
    ]);
    assertObjectArrayElementPropertySet(practicalplantsCrops, 'functions', [
      'function',
      'details'
    ]);
    assertObjectArrayElementPropertySet(practicalplantsCrops, 'shelter', [
      'shelter',
      'details'
    ]);
    assertObjectArrayElementPropertySet(practicalplantsCrops, 'forage', [
      'forage',
      'details'
    ]);
    assertObjectArrayElementPropertySet(practicalplantsCrops, 'crops', [
      'part of plant',
      'harvest',
      'requires processing',
      'processing',
      'is storable',
      'storage'
    ]);
    assertObjectArrayElementPropertySet(practicalplantsCrops, 'subspecies', [
      'rank',
      'name',
      'synonyms',
      'common names',
      'cultivar group',
      'details'
    ]);
    assertObjectArrayElementPropertySet(
      practicalplantsCrops,
      'cultivar groups',
      ['name', 'common names', 'details']
    );
    assertObjectArrayElementPropertySet(
      practicalplantsCrops,
      'ungrouped cultivars',
      ['name', 'description']
    );
  });

  it.skip('for debugging, output a modified and filtered version of the PracticalplantsCrop dataset', () => {
    /* stderr has less noise than stdout */
    console.error('module.exports = [');
    practicalplantsCrops
      .map(crop => {
        PracticalplantsCrop.OBJECT_ARRAY_PROPERTIES.forEach(property => {
          if (!PracticalplantsCrop.isUndefined(crop, property)) {
            crop[property] = [crop[property]];
          }
        });
        return crop;
      })
      .filter(crop => {
        return true;
      })
      .forEach(crop => {
        console.error(utils.convertObjectToString(crop));
        console.error(',');
      });
    console.error('];');
  });

  it('set of crops that have salinity is analyzed', () => {
    const expectedCropsThatHaveSalinity = [
      'Acacia farnesiana', // Sweet Acacia
      'Acacia longifolia', // Sidney Golden Wattle
      'Acacia mucronata', // undefined
      'Acacia retinodes', // Swamp Wattle
      'Acacia saligna', // Blue-Leaved Wattle
      'Agropyron elongatum', // Tall Wheatgrass
      'Albizia julibrissin', // Mimosa, Persian silk tree, Silk tree, Nemunoki
      'Alhagi maurorum', // Camel Thorn
      'Alnus maritima', // Seaside Alder
      'Althaea officinalis', // Marsh Mallow
      'Amaranthus caudatus', // Love Lies Bleeding
      'Anemopsis californica', // Yerba Mansa
      'Apium australe', // undefined
      'Apium graveolens', // Wild Celery
      'Apium prostratum', // Sea Celery
      'Armeria maritima', // Sea Thrift
      'Artemisia maritima', // Sea Wormwood
      'Arthrocnemum fruticosum', // Glasswort
      'Asparagus officinalis', // Asparagus
      'Aster tripolium', // Sea Aster
      'Atriplex arenaria', // undefined
      'Atriplex argentea', // Silvery Orach
      'Atriplex argentea expansa', // Silverscale Saltbush
      'Atriplex californica', // undefined
      'Atriplex canescens', // Grey Sage Brush
      'Atriplex carnosa', // undefined
      'Atriplex confertifolia', // Shadscale
      'Atriplex coronata', // Crownscale
      'Atriplex dimorphostegia', // undefined
      'Atriplex elegans', // Wheelscale Saltbush
      'Atriplex glabriuscula', // undefined
      'Atriplex gmelinii', // undefined
      'Atriplex halimus', // Saltbush, Sea Orach
      'Atriplex hastata', // Hastate Orach
      'Atriplex hortensis', // Orach
      'Atriplex lapathifolia', // undefined
      'Atriplex lentiformis', // Quail Bush
      'Atriplex maximowicziana', // undefined
      'Atriplex nummularia', // Giant Saltbush
      'Atriplex nuttallii', // Nuttall's Saltbush
      'Atriplex patula', // Spreading Orach
      'Atriplex powellii', // Powell's Saltweed
      'Atriplex saccaria', // Sack Saltbush
      'Atriplex serenana', // Bractscale
      'Atriplex subcordata', // undefined
      'Atriplex tatarica', // undefined
      'Atriplex truncata', // Wedgescale Saltbush
      'Avena byzantina', // Red Oat
      'Baccharis halimifolia', // Bush Groundsel
      'Baccharis patagonica', // undefined
      'Beckmannia eruciformis', // Sloughgrass
      'Beckmannia syzigachne', // American Sloughgrass
      'Beta lomatogona', // undefined
      'Beta trigyna', // undefined
      'Beta vulgaris altissima', // Sugar Beet
      'Beta vulgaris cicla', // Spinach Beet
      'Beta vulgaris craca', // Beetroot
      'Beta vulgaris flavescens', // Swiss Chard
      'Beta vulgaris maritima', // Sea Beet
      'Bumelia lanuginosa', // Chittamwood
      'Bumelia lycioides', // Shittamwood
      'Bumelia tenax', // Ironwood
      'Calandrinia balonensis', // undefined
      'Calandrinia polyandra', // undefined
      'Calandrinia remota', // undefined
      'Callitris columellaris', // White Cypress-Pine
      'Callitris endlicheri', // Red Cypress-Pine
      'Camphorosma monspeliaca', // undefined
      'Capsella bursa-pastoris', // Shepherd's Purse
      'Carex acutiformis', // Swamp Sedge
      'Carpobrotus acinaciformis', // Hottentot Fig
      'Carpobrotus aequilaterus', // Sea Fig
      'Carpobrotus deliciosus', // Sweet Hottentot Fig
      'Carpobrotus edulis', // Hottentot Fig
      'Casuarina glauca', // Swamp Oak
      'Casuarina verticillata', // undefined
      'Chenopodium fremontii', // Goosefoot
      'Chenopodium pallidicaule', // Caï¿½ihua
      'Chenopodium quinoa', // Quinoa
      'Chenopodium vulvaria', // Stinking Goosefoot
      'Chrysothamnus nauseosus', // Rubber Rabbitbrush
      'Cichorium intybus', // Chicory
      'Cochlearia anglica', // Long Leaved Scurvy Grass
      'Cochlearia danica', // Danish Scurvy Grass
      'Cochlearia officinalis', // Scurvy Grass
      'Cochlearia scotica', // undefined
      'Conioselinum pacificum', // Pacific Hemlock-Parsley
      'Correa alba', // Cape Barren Tea
      'Crambe maritima', // Seacale
      'Crithmum maritimum', // Rock Samphire
      'Cynara scolymus', // Globe Artichoke
      'Cynodon dactylon', // Bermuda Grass
      'Cyperus tegetiformis', // undefined
      'Descurainia antarctica', // undefined
      'Dianthus caryophyllus', // Carnation
      'Elaeagnus angustifolia', // Oleaster
      'Eleusine coracana', // Finger Millet
      'Elytrigia juncea', // Sand Couch
      'Enchylaena tomentosa', // Ruby Saltbush
      'Eryngium maritimum', // Sea Holly
      'Eucalyptus camaldulensis', // Red River Gum
      'Eucalyptus gummifera', // Red Bloodwood
      'Eucalyptus largiflorens', // Black Box
      'Ferula caspica', // undefined
      'Ferula szowitziana', // undefined
      'Fritillaria camschatcensis', // Kamchatka Lily
      'Glaux maritima', // Black Saltwort
      'Gleditsia triacanthos', // Honey Locust
      'Glehnia littoralis', // Bei Sha Shen
      'Grindelia humilis', // Hairy Gumweed
      'Grindelia robusta', // Great Valley Gumweed
      'Gymnocladus dioica', // Kentucky Coffee Tree
      'Halimione portulacoides', // Sea Purslane
      'Halimodendron halodendron', // Salt Tree
      'Haloxylon ammodendron', // undefined
      'Haloxylon persicum', // Salt Tree
      'Inula crithmoides', // Golden Samphire
      'Iris setosa', // Beachhead Iris
      'Juncus acutus', // Sharp Rush
      'Juncus balticus', // Baltic Rush
      'Juncus procerus', // undefined
      'Juniperus horizontalis', // Creeping Juniper
      'Lavandula angustifolia', // Lavender
      'Lavandula latifolia', // Spike Lavender
      'Lavandula x intermedia', // Lavender
      'Leitneria floridana', // Corkwood
      'Lepidium latifolium', // Dittander
      'Leymus condensatus', // Giant Wild Rye
      'Leymus triticoides', // Squaw Grass
      'Limonium carolinianum', // Sea Lavender
      'Limonium vulgare', // Sea Lavender
      'Lolium perenne', // Perennial Ryegrass
      'Lycium ruthenicum', // undefined
      'Matricaria recutita', // German Camomile
      'Megacarpaea megalocarpa', // undefined
      'Melilotus officinalis', // Melilot
      'Melilotus wolgicus', // undefined
      'Mesembryanthemum crystallinum', // Ice Plant
      'Microseris nutans', // Yam Daisy
      'Microseris procera', // Yam Daisy
      'Microseris scapigera', // Yam Daisy
      'Monolepis nuttalliana', // Poverty Weed
      'Myoporum laetum', // Ngaio
      'Myrica pensylvanica', // Northern Bayberry
      'Najas flexilis', // undefined
      'Najas marina', // Spiny Naiad
      'Nitraria schoberi', // undefined
      'Peganum harmala', // Syrian Rue
      'Peucedanum officinale', // Hog's Fennel
      'Phormium tenax', // New Zealand Flax
      'Phragmites australis', // Common Reed
      'Phyllospadix scouleri', // Surf Grass
      'Phyllospadix torreyi', // Sea Grass
      'Pinus muricata', // Bishop's Pine
      'Plantago crassifolia', // undefined
      'Plantago decipiens', // undefined
      'Plantago maritima', // Sea Plantain
      'Plantago oliganthus', // undefined
      'Podolepis jaceoides', // Copperwire Daisy
      'Polygonum equisetiforme', // undefined
      'Polygonum sibiricum', // undefined
      'Potamogeton crispus', // Curly Pondweed
      'Potentilla hippiana', // Woolly Cinquefoil
      'Prunus avium', // Sweet Cherry, Wild Cherry
      'Psoralea macrostachya', // Large Leather Root
      'Puccinellia distans', // Sweet Grass
      'Quercus virginiana', // Live Oak
      'Rhagodia candolleana', // Coastal Saltbush
      'Rohdea japonica', // Nippon Lily, Sacred Lily, Omoto
      'Rumex mexicanus', // Mexican Dock
      'Sagittaria rigida', // undefined
      'Salicornia ambigua', // undefined
      'Salicornia bigelovii', // Dwarf Glasswort
      'Salicornia europaea', // Glasswort
      'Salicornia quinqueflora', // Chicken Claws
      'Salix hookeriana', // Dune Willow
      'Salix purpurea', // Purple Osier
      'Salix purpurea lambertiana', // Purple Osier
      'Salsola asparagoides', // undefined
      'Salsola collina', // Tumbleweed
      'Salsola kali', // Saltwort
      'Salsola kali ruthenica', // Prickly Russian Thistle
      'Salsola komarovi', // undefined
      'Salsola soda', // Barilla Plant
      'Sapium sebiferum', // Vegetable Tallow
      'Sarcobatus vermiculatus', // Greasewood
      'Scirpus affinis', // undefined
      'Scirpus fluviatilis', // River Bulrush
      'Scirpus maritimus', // Seaside Bulrush
      'Scirpus paludosus', // Bayonet Grass
      'Scorzonera mongolica', // undefined
      'Scorzonera parviflora', // undefined
      'Serenoa repens', // Saw Palmetto
      'Sonchus arvensis', // Field Milk Thistle
      'Spartina anglica', // Cord Grass
      'Spartina pectinata', // Prairie Cord Grass
      'Spartina x townsendii', // Townsend's Cord Grass
      'Sporobolus airoides', // Alkali Sakaton
      'Sporobolus pallidus', // undefined
      'Suaeda australis', // Seablite
      'Suaeda californica', // undefined
      'Suaeda corniculata', // undefined
      'Suaeda depressa', // undefined
      'Suaeda fruticosa', // Shrubby Seablite
      'Suaeda glauca', // undefined
      'Suaeda heterotropa', // undefined
      'Suaeda japonica', // undefined
      'Suaeda linearis', // undefined
      'Suaeda maritima', // Sea Blite
      'Suaeda occidentalis', // undefined
      'Suaeda palmeri', // undefined
      'Suaeda ramosissima', // undefined
      'Suaeda salsa', // undefined
      'Suaeda suffrutescens', // Desert Seepweed
      'Succisa pratensis', // Devil's Bit Scabious
      'Tamarix africana', // undefined
      'Tamarix anglica', // English Tree
      'Tamarix aphylla', // Athel Tamarisk
      'Tamarix canariensis', // Tamarisk
      'Tamarix chinensis', // Chinese Tamarisk
      'Tamarix gallica', // Manna Plant
      'Tamarix hispida', // Kashgar Tree
      'Tamarix juniperina', // undefined
      'Tamarix ramosissima', // Tamarisk
      'Taraxacum hybernum', // undefined
      'Taxodium distichum', // Swamp Cypress
      'Tetragonia tetragonoides', // New Zealand Spinach
      'Triglochin maritima', // Sea Arrow Grass
      'Triglochin palustris', // Marsh Arrow Grass
      'Triglochin procera', // Water Ribbons
      'Typha domingensis', // Southern Cattail
      'Uniola paniculata', // Sea Oats
      'Valeriana obovata', // Tobacco Root
      'Washingtonia filifera', // Desert Fan Palm
      'Zannichellia palustris', // Horned Pondweed
      'Zostera marina' // Eel Grass
    ];

    const actualCropsThatHaveSalinity = [];
    practicalplantsCrops.forEach(crop => {
      if (crop.salinity) {
        actualCropsThatHaveSalinity.push(crop);
      }
    });

    assert.equal(expectedCropsThatHaveSalinity.length, 236);
    assert.equal(
      actualCropsThatHaveSalinity.length,
      expectedCropsThatHaveSalinity.length
    );

    actualCropsThatHaveSalinity.forEach(crop => {
      assert.equal(expectedCropsThatHaveSalinity.includes(crop.binomial), true);
    });
  });

  it('missing counts', () => {
    /*
     * TODO Assert counts instead of missing counts.
     * TODO Assert counts for every property.
     */
    let missingCounts = {};

    practicalplantsCrops.forEach(object => {
      updateMissingCount(missingCounts, object, 'common');
      updateMissingCount(missingCounts, object, 'binomial');
      updateMissingCount(missingCounts, object, 'hardiness zone');
      updateMissingCount(missingCounts, object, 'soil texture');
      updateMissingCount(missingCounts, object, 'soil ph');
      updateMissingCount(missingCounts, object, 'soil water retention');
      updateMissingCount(missingCounts, object, 'shade');
      updateMissingCount(missingCounts, object, 'sun');
      updateMissingCount(missingCounts, object, 'water');
      updateMissingCount(missingCounts, object, 'drought');
      updateMissingCount(missingCounts, object, 'poornutrition');
      updateMissingCount(missingCounts, object, 'ecosystem niche');
      updateMissingCount(missingCounts, object, 'life cycle');
      updateMissingCount(missingCounts, object, 'herbaceous or woody');
      updateMissingCount(missingCounts, object, 'deciduous or evergreen');
      updateMissingCount(missingCounts, object, 'growth rate');
      updateMissingCount(missingCounts, object, 'mature measurement unit');
      updateMissingCount(missingCounts, object, 'mature height');
      updateMissingCount(missingCounts, object, 'mature width');
      updateMissingCount(missingCounts, object, 'flower type');
      updateMissingCount(missingCounts, object, 'pollinators');
      updateMissingCount(missingCounts, object, 'wind');
      updateMissingCount(missingCounts, object, 'maritime');
      updateMissingCount(missingCounts, object, 'pollution');
      updateMissingCount(missingCounts, object, 'grow from');
      updateMissingCount(missingCounts, object, 'cutting type');
      updateMissingCount(missingCounts, object, 'fertility');
      updateMissingCount(missingCounts, object, 'root zone');
      updateMissingCount(missingCounts, object, 'family');
      updateMissingCount(missingCounts, object, 'genus');
      updateMissingCount(missingCounts, object, 'salinity');
    });

    assert.equal(missingCounts['common'], 2884);
    assert.equal(missingCounts['binomial'], undefined);
    assert.equal(missingCounts['hardiness zone'], 2534);
    assert.equal(missingCounts['soil texture'], 3);
    assert.equal(missingCounts['soil ph'], 2);
    assert.equal(missingCounts['soil water retention'], 2997);
    assert.equal(missingCounts['shade'], 2);
    assert.equal(missingCounts['sun'], 280);
    assert.equal(missingCounts['water'], 1);
    assert.equal(missingCounts['drought'], 2);
    assert.equal(missingCounts['poornutrition'], 6);
    assert.equal(missingCounts['ecosystem niche'], 5699);
    assert.equal(missingCounts['life cycle'], 752);
    assert.equal(missingCounts['herbaceous or woody'], 4306);
    assert.equal(missingCounts['deciduous or evergreen'], 3924);
    assert.equal(missingCounts['growth rate'], 6177);
    assert.equal(missingCounts['mature measurement unit'], 141);
    assert.equal(missingCounts['mature height'], 1005);
    assert.equal(missingCounts['mature width'], 4898);
    assert.equal(missingCounts['flower type'], 127);
    assert.equal(missingCounts['pollinators'], 1878);
    assert.equal(missingCounts['wind'], 6237);
    assert.equal(missingCounts['maritime'], 6767);
    assert.equal(missingCounts['pollution'], 7257);
    assert.equal(missingCounts['grow from'], 7354);
    assert.equal(missingCounts['cutting type'], 7385);
    assert.equal(missingCounts['fertility'], 5337);
    assert.equal(missingCounts['root zone'], 7405);
    assert.equal(missingCounts['family'], 5);
    assert.equal(missingCounts['genus'], 6);
    assert.equal(missingCounts['salinity'], 7180);
  }).timeout(0);

  it('normalized data passes integrity checks', () => {
    assert.equal(crops.length, 7416);

    crops.forEach(object => {
      assert.isNotNull(object);
      assert.equal(typeof object, 'object');

      Object.keys(object).forEach(property =>
        assert.isTrue(
          Crop.PROPERTIES.includes(property),
          'Unknown property "' + property + '"'
        )
      );

      assertValueOrMissing(object, 'hardinessZone', Crop.HARDINESS_ZONE_VALUES);
      assertValueOrMissing(object, 'soilTexture', Crop.SOIL_TEXTURE_VALUES);
      assertValueOrMissing(object, 'soilPh', Crop.SOIL_PH_VALUES);
      assertValueOrMissing(
        object,
        'soilWaterRetention',
        Crop.SOIL_WATER_RETENTION_VALUES
      );
      assertValueOrMissing(object, 'shade', Crop.SHADE_VALUES);
      assertValueOrMissing(object, 'sun', Crop.SUN_VALUES);
      assertValueOrMissing(object, 'water', Crop.WATER_VALUES);
      assertValueOrMissing(object, 'drought', Crop.DROUGHT_VALUES);
      assertValueOrMissing(object, 'poorNutrition', Crop.BOOLEAN_VALUES);
      assertValueOrMissing(object, 'wind', Crop.BOOLEAN_VALUES);
      assertValueOrMissing(object, 'maritime', Crop.BOOLEAN_VALUES);
      assertValueOrMissing(object, 'pollution', Crop.BOOLEAN_VALUES);
      assertValueOrMissing(
        object,
        'ecosystemNiche',
        Crop.ECOSYSTEM_NICHE_VALUES
      );
      assertValueOrMissing(object, 'lifeCycle', Crop.LIFE_CYCLE_VALUES);
      assertValueOrMissing(
        object,
        'herbaceousOrWoody',
        Crop.HERBACEOUS_OR_WOODY_VALUES
      );
      assertValueOrMissing(
        object,
        'deciduousOrEvergreen',
        Crop.DECIDUOUS_OR_EVERGREEN_VALUES
      );
      assertValueOrMissing(object, 'growthRate', Crop.GROWTH_RATE_VALUES);
      assertValueOrMissing(
        object,
        'matureMeasurementUnit',
        Crop.MATURE_MEASUREMENT_UNIT_VALUES
      );
      assertValueOrMissing(object, 'matureHeight', Crop.MATURE_HEIGHT_VALUES);
      assertValueOrMissing(object, 'matureWidth', Crop.MATURE_WIDTH_VALUES);
      assertValueOrMissing(object, 'flowerType', Crop.FLOWER_TYPE_VALUES);
      assertValueOrMissing(object, 'pollinators', Crop.POLLINATORS_VALUES);
      assertValueOrMissing(object, 'growFrom', Crop.GROW_FROM_VALUES);
      assertValueOrMissing(object, 'cuttingType', Crop.CUTTING_TYPE_VALUES);
      assertValueOrMissing(object, 'fertility', Crop.FERTILITY_VALUES);
      assertValueOrMissing(object, 'rootZone', Crop.ROOT_ZONE_VALUES);
      assertValueOrMissing(object, 'family', Crop.FAMILY_VALUES);
      assertValueOrMissing(object, 'genus', Crop.GENUS_VALUES);

      assertNamedPropertyStartsWithUpperCase(object);

      {
        /*
         * Assert that some properties that describe a range of values (for
         * example soil ph, from acid to alkaline) also contain all of the
         * values in between. This quality is used by the companionship
         * algorithm.
         */
        assertArrayPropertyOfRangeHasAllValuesInBetween(
          object.soilPh,
          PracticalplantsCrop.SOIL_PH_VALUES
        );
        assertArrayPropertyOfRangeHasAllValuesInBetween(
          object.soilTexture,
          PracticalplantsCrop.SOIL_TEXTURE_VALUES
        );
        assertArrayPropertyOfRangeHasAllValuesInBetween(
          object.soilWaterRetention,
          PracticalplantsCrop.SOIL_WATER_RETENTION_VALUES
        );
      }
    });
  }).timeout(0);

  it('no duplicates in enum definitions', () => {
    assertNoDuplicates(Crop.BOOLEAN_VALUES);
    assertNoDuplicates(Crop.SOIL_TEXTURE_VALUES);
    assertNoDuplicates(Crop.SOIL_WATER_RETENTION_VALUES);
    assertNoDuplicates(Crop.SHADE_VALUES);
    assertNoDuplicates(Crop.SUN_VALUES);
    assertNoDuplicates(Crop.WATER_VALUES);
    assertNoDuplicates(Crop.DROUGHT_VALUES);
    assertNoDuplicates(Crop.ECOSYSTEM_NICHE_VALUES);
    assertNoDuplicates(Crop.LIFE_CYCLE_VALUES);
    assertNoDuplicates(Crop.HERBACEOUS_OR_WOODY_VALUES);
    assertNoDuplicates(Crop.DECIDUOUS_OR_EVERGREEN_VALUES);
    assertNoDuplicates(Crop.GROWTH_RATE_VALUES);
    assertNoDuplicates(Crop.MATURE_MEASUREMENT_UNIT_VALUES);
    assertNoDuplicates(Crop.FLOWER_TYPE_VALUES);
    assertNoDuplicates(Crop.POLLINATORS_VALUES);
    assertNoDuplicates(Crop.FUNCTIONS_VALUES);
    assertNoDuplicates(Crop.FUNCTIONS_VALUES);
    assertNoDuplicates(Crop.GROW_FROM_VALUES);
    assertNoDuplicates(Crop.CUTTING_TYPE_VALUES);
    assertNoDuplicates(Crop.FERTILITY_VALUES);
    assertNoDuplicates(Crop.ROOT_ZONE_VALUES);
    assertNoDuplicates(Crop.FAMILY_VALUES);
    assertNoDuplicates(Crop.GENUS_VALUES);
    assertNoDuplicates(Crop.SALINITY_VALUES);
  });
});
