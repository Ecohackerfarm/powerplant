const { assert } = require('chai');
const PracticalplantsCrop = require('../../shared/practicalplants-crop.js');
const Crop = require('../../shared/crop.js');
const utils = require('../../shared/utils.js');

describe('practicalplants.json', () => {
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

  /**
   * @param {String} property
   * @param {Number} count
   */
  function assertNumberOfCropsThatHaveProperty(property, count) {
    assert.isTrue(PracticalplantsCrop.PROPERTIES.includes(property), property);
    assert.equal(
      getCropsThatHaveProperty(practicalplantsCrops, property).size,
      count,
      property
    );
  }

  /**
   * @param {PracticalplantsCrop[]} crops
   * @param {String} property
   * @return {Set} Set of binomial names.
   */
  function getCropsThatHaveProperty(crops, property) {
    const subset = new Set();
    crops.forEach(crop => {
      if (!PracticalplantsCrop.isUndefined(crop, property)) {
        subset.add(crop.binomial);
      }
    });
    return subset;
  }

  /**
   * @param {String} property
   * @param {Number} expectedCount
   */
  function assertUniqueValueCount(property, expectedCount) {
    let cropProperty;
    let elementProperty;
    if (Array.isArray(property)) {
      cropProperty = property[0];
      elementProperty = property[1];

      assert.isTrue(
        PracticalplantsCrop.OBJECT_ARRAY_PROPERTIES.includes(cropProperty),
        property
      );
    } else {
      cropProperty = property;
      elementProperty = undefined;

      assert.isTrue(
        !PracticalplantsCrop.OBJECT_ARRAY_PROPERTIES.includes(cropProperty),
        property
      );
    }

    const values = new Set();
    practicalplantsCrops.forEach(crop => {
      if (!PracticalplantsCrop.isUndefined(crop, cropProperty)) {
        if (PracticalplantsCrop.ARRAY_PROPERTIES.includes(cropProperty)) {
          if (
            PracticalplantsCrop.OBJECT_ARRAY_PROPERTIES.includes(cropProperty)
          ) {
            crop[cropProperty].forEach(element => {
              if (!PracticalplantsCrop.isUndefined(element, elementProperty)) {
                if (
                  PracticalplantsCrop.propertySetIncludes(
                    PracticalplantsCrop.ELEMENT_ARRAY_PROPERTIES,
                    property
                  )
                ) {
                  utils.addAllToSet(
                    values,
                    PracticalplantsCrop.getAsArray(element[elementProperty])
                  );
                } else {
                  values.add(element[elementProperty]);
                }
              }
            });
          } else {
            utils.addAllToSet(
              values,
              PracticalplantsCrop.getAsArray(crop[cropProperty])
            );
          }
        } else {
          values.add(crop[cropProperty]);
        }
      }
    });

    assert.equal(values.size, expectedCount, Array.from(values));
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
    assert.equal(practicalplantsCrops.length, 7414);
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
    assertSetAndArrayEqual(
      getCropsThatHaveProperty(practicalplantsCrops, 'salinity'),
      expectedCropsThatHaveSalinity
    );
    assert.equal(expectedCropsThatHaveSalinity.length, 236);
  });

  it('number of crops that have property', () => {
    /*
     * TODO What are these properties that are used in 0 crops?
     */
    assertNumberOfCropsThatHaveProperty('append to article summary', 22);
    assertNumberOfCropsThatHaveProperty('article summary', 0);
    assertNumberOfCropsThatHaveProperty('primary image', 2889);
    assertNumberOfCropsThatHaveProperty('binomial', 7414);
    assertNumberOfCropsThatHaveProperty('genus', 7408);
    assertNumberOfCropsThatHaveProperty('family', 7409);
    assertNumberOfCropsThatHaveProperty('life cycle', 6662);
    assertNumberOfCropsThatHaveProperty('herbaceous or woody', 3066);
    assertNumberOfCropsThatHaveProperty('deciduous or evergreen', 3402);
    assertNumberOfCropsThatHaveProperty('flower type', 7287);
    assertNumberOfCropsThatHaveProperty('growth rate', 1238);
    assertNumberOfCropsThatHaveProperty('mature height', 6409);
    assertNumberOfCropsThatHaveProperty('mature width', 2517);
    assertNumberOfCropsThatHaveProperty('sun', 7134);
    assertNumberOfCropsThatHaveProperty('shade', 7412);
    assertNumberOfCropsThatHaveProperty('hardiness zone', 4881);
    assertNumberOfCropsThatHaveProperty('water', 7413);
    assertNumberOfCropsThatHaveProperty('drought', 7412);
    assertNumberOfCropsThatHaveProperty('soil texture', 7411);
    assertNumberOfCropsThatHaveProperty('soil ph', 7412);
    assertNumberOfCropsThatHaveProperty('wind', 1177);
    assertNumberOfCropsThatHaveProperty('maritime', 647);
    assertNumberOfCropsThatHaveProperty('pollution', 157);
    assertNumberOfCropsThatHaveProperty('poornutrition', 7408);
    assertNumberOfCropsThatHaveProperty('edible part and use', 5764);
    assertNumberOfCropsThatHaveProperty('material use notes', 95);
    assertNumberOfCropsThatHaveProperty('PFAF material use notes', 3777);
    assertNumberOfCropsThatHaveProperty('material part and use', 3227);
    assertNumberOfCropsThatHaveProperty('medicinal part and use', 3720);
    assertNumberOfCropsThatHaveProperty('toxic parts', 15);
    assertNumberOfCropsThatHaveProperty('functions', 452);
    assertNumberOfCropsThatHaveProperty('shelter', 2);
    assertNumberOfCropsThatHaveProperty('forage', 12);
    assertNumberOfCropsThatHaveProperty('propagation notes', 1);
    assertNumberOfCropsThatHaveProperty('PFAF propagation notes', 7132);
    assertNumberOfCropsThatHaveProperty('seed requires stratification', 156);
    assertNumberOfCropsThatHaveProperty('seed dormancy depth', 6);
    assertNumberOfCropsThatHaveProperty('seed requires scarification', 156);
    assertNumberOfCropsThatHaveProperty('seed requires smokification', 156);
    assertNumberOfCropsThatHaveProperty('rootstocks', 0);
    assertNumberOfCropsThatHaveProperty('cultivation notes', 0);
    assertNumberOfCropsThatHaveProperty('PFAF cultivation notes', 7253);
    assertNumberOfCropsThatHaveProperty('crops', 12);
    assertNumberOfCropsThatHaveProperty('interactions', 0);
    assertNumberOfCropsThatHaveProperty('botanical references', 626);
    assertNumberOfCropsThatHaveProperty('material uses references', 0);
    assertNumberOfCropsThatHaveProperty('range', 7382);
    assertNumberOfCropsThatHaveProperty('habitat', 7392);
    assertNumberOfCropsThatHaveProperty('enabled', 7329);
    assertNumberOfCropsThatHaveProperty('title irregular', 7392);
    assertNumberOfCropsThatHaveProperty('common', 4531);
    assertNumberOfCropsThatHaveProperty('soil water retention', 4418);
    assertNumberOfCropsThatHaveProperty('medicinal use notes', 115);
    assertNumberOfCropsThatHaveProperty('toxicity notes', 103);
    assertNumberOfCropsThatHaveProperty('grow from', 61);
    assertNumberOfCropsThatHaveProperty('germination details', 39);
    assertNumberOfCropsThatHaveProperty('cultivation', 138);
    assertNumberOfCropsThatHaveProperty('edible uses references', 0);
    assertNumberOfCropsThatHaveProperty('medicinal uses references', 0);
    assertNumberOfCropsThatHaveProperty('mature measurement unit', 7275);
    assertNumberOfCropsThatHaveProperty('pollinators', 5538);
    assertNumberOfCropsThatHaveProperty('edible use notes', 113);
    assertNumberOfCropsThatHaveProperty('PFAF edible use notes', 5738);
    assertNumberOfCropsThatHaveProperty('PFAF medicinal use notes', 3983);
    assertNumberOfCropsThatHaveProperty('override summary', 37);
    assertNumberOfCropsThatHaveProperty('ecosystem niche', 1717);
    assertNumberOfCropsThatHaveProperty('problems', 2);
    assertNumberOfCropsThatHaveProperty('PFAF toxicity notes', 2353);
    assertNumberOfCropsThatHaveProperty('infraspecific epithet', 0);
    assertNumberOfCropsThatHaveProperty('cultivar of groups', 0);
    assertNumberOfCropsThatHaveProperty('cultivar epithet', 0);
    assertNumberOfCropsThatHaveProperty('cultivar group epithet', 0);
    assertNumberOfCropsThatHaveProperty('life references', 10);
    assertNumberOfCropsThatHaveProperty('subspecies', 2);
    assertNumberOfCropsThatHaveProperty('cultivar groups', 1);
    assertNumberOfCropsThatHaveProperty('cutting type', 25);
    assertNumberOfCropsThatHaveProperty('cutting details', 23);
    assertNumberOfCropsThatHaveProperty('problem notes', 10);
    assertNumberOfCropsThatHaveProperty('salinity', 236);
    assertNumberOfCropsThatHaveProperty('fertility', 2079);
    assertNumberOfCropsThatHaveProperty('propagation', 131);
    assertNumberOfCropsThatHaveProperty('common use description', 45);
    assertNumberOfCropsThatHaveProperty('flower colour', 47);
    assertNumberOfCropsThatHaveProperty('common habit description', 45);
    assertNumberOfCropsThatHaveProperty('ungrouped cultivars', 1);
    assertNumberOfCropsThatHaveProperty('functions notes', 16);
    assertNumberOfCropsThatHaveProperty('botanical description', 27);
    assertNumberOfCropsThatHaveProperty('crop notes', 7);
    assertNumberOfCropsThatHaveProperty('classification references', 5);
    assertNumberOfCropsThatHaveProperty('environmental references', 7);
    assertNumberOfCropsThatHaveProperty('native range', 24);
    assertNumberOfCropsThatHaveProperty('native environment', 16);
    assertNumberOfCropsThatHaveProperty('ecosystems references', 9);
    assertNumberOfCropsThatHaveProperty('uses intro', 3);
    assertNumberOfCropsThatHaveProperty('seed saving details', 6);
    assertNumberOfCropsThatHaveProperty('root zone', 11);
    assertNumberOfCropsThatHaveProperty('taxonomic rank', 18);
    assertNumberOfCropsThatHaveProperty('functions as', 26);
    assertNumberOfCropsThatHaveProperty('shelter notes', 4);
    assertNumberOfCropsThatHaveProperty('forage notes', 3);
    assertNumberOfCropsThatHaveProperty('material uses', 2);
    assertNumberOfCropsThatHaveProperty('heat zone', 4);
    assertNumberOfCropsThatHaveProperty('bulb type', 1);
    assertNumberOfCropsThatHaveProperty('graft rootstock', 2);
    assertNumberOfCropsThatHaveProperty('edible parts', 2);
    assertNumberOfCropsThatHaveProperty('edible uses', 3);
    assertNumberOfCropsThatHaveProperty('show cultivar group', 7);
    assertNumberOfCropsThatHaveProperty('cultivar group', 2);
    assertNumberOfCropsThatHaveProperty('is a variety', 7);
    assertNumberOfCropsThatHaveProperty('variety type', 1);
    assertNumberOfCropsThatHaveProperty('cultivar name', 1);
    assertNumberOfCropsThatHaveProperty('cultivar of', 1);
    assertNumberOfCropsThatHaveProperty('variety name', 0);
    assertNumberOfCropsThatHaveProperty('variety of', 0);
    assertNumberOfCropsThatHaveProperty('subspecies name', 0);
    assertNumberOfCropsThatHaveProperty('subspecies of', 0);
    assertNumberOfCropsThatHaveProperty('summary', 0);
    assertNumberOfCropsThatHaveProperty('cultivar group of', 1);
    assertNumberOfCropsThatHaveProperty('seed stratification instructions', 0);
    assertNumberOfCropsThatHaveProperty('graft details', 1);
    assertNumberOfCropsThatHaveProperty('bulb details', 1);
    assertNumberOfCropsThatHaveProperty('subspecific epithet', 2);
    assertNumberOfCropsThatHaveProperty('cultivar notes', 1);
  }).timeout(0);

  it('unique value counts', () => {
    assertUniqueValueCount('append to article summary', 22);
    assertUniqueValueCount('article summary', 0);
    assertUniqueValueCount('primary image', 2887);
    assertUniqueValueCount('binomial', 7414);
    assertUniqueValueCount('genus', 1660);
    assertUniqueValueCount('family', 282);
    assertUniqueValueCount('life cycle', 3);
    assertUniqueValueCount('herbaceous or woody', 2);
    assertUniqueValueCount('deciduous or evergreen', 2);
    assertUniqueValueCount('flower type', 3);
    assertUniqueValueCount('growth rate', 3);
    assertUniqueValueCount('mature height', 90);
    assertUniqueValueCount('mature width', 47);
    assertUniqueValueCount('sun', 3);
    assertUniqueValueCount('shade', 5);
    assertUniqueValueCount('hardiness zone', 12);
    assertUniqueValueCount('water', 4);
    assertUniqueValueCount('drought', 3);
    assertUniqueValueCount('soil texture', 4);
    assertUniqueValueCount('soil ph', 5);
    assertUniqueValueCount('wind', 4);
    assertUniqueValueCount('maritime', 4);
    assertUniqueValueCount('pollution', 4);
    assertUniqueValueCount('poornutrition', 4);
    assertUniqueValueCount('material use notes', 91);
    assertUniqueValueCount('PFAF material use notes', 2764);
    assertUniqueValueCount('propagation notes', 1);
    assertUniqueValueCount('PFAF propagation notes', 2332);
    assertUniqueValueCount('seed requires stratification', 4);
    assertUniqueValueCount('seed dormancy depth', 2);
    assertUniqueValueCount('seed requires scarification', 3);
    assertUniqueValueCount('seed requires smokification', 2);
    assertUniqueValueCount('rootstocks', 0);
    assertUniqueValueCount('cultivation notes', 0);
    assertUniqueValueCount('PFAF cultivation notes', 6283);
    assertUniqueValueCount('interactions', 0);
    assertUniqueValueCount('botanical references', 6);
    assertUniqueValueCount('material uses references', 0);
    assertUniqueValueCount('range', 4000);
    assertUniqueValueCount('habitat', 5955);
    assertUniqueValueCount('enabled', 1);
    assertUniqueValueCount('title irregular', 2);
    assertUniqueValueCount('common', 4206);
    assertUniqueValueCount('soil water retention', 3);
    assertUniqueValueCount('medicinal use notes', 102);
    assertUniqueValueCount('toxicity notes', 50);
    assertUniqueValueCount('grow from', 7);
    assertUniqueValueCount('germination details', 39);
    assertUniqueValueCount('cultivation', 135);
    assertUniqueValueCount('edible uses references', 0);
    assertUniqueValueCount('medicinal uses references', 0);
    assertUniqueValueCount('mature measurement unit', 3);
    assertUniqueValueCount('pollinators', 48);
    assertUniqueValueCount('edible use notes', 102);
    assertUniqueValueCount('PFAF edible use notes', 3765);
    assertUniqueValueCount('PFAF medicinal use notes', 3209);
    assertUniqueValueCount('override summary', 2);
    assertUniqueValueCount('ecosystem niche', 7);
    assertUniqueValueCount('problems', 2);
    assertUniqueValueCount('PFAF toxicity notes', 681);
    assertUniqueValueCount('infraspecific epithet', 0);
    assertUniqueValueCount('cultivar of groups', 0);
    assertUniqueValueCount('cultivar epithet', 0);
    assertUniqueValueCount('cultivar group epithet', 0);
    assertUniqueValueCount('life references', 12);
    assertUniqueValueCount('cutting type', 4);
    assertUniqueValueCount('cutting details', 23);
    assertUniqueValueCount('problem notes', 10);
    assertUniqueValueCount('salinity', 2);
    assertUniqueValueCount('fertility', 2);
    assertUniqueValueCount('propagation', 99);
    assertUniqueValueCount('common use description', 6);
    assertUniqueValueCount('flower colour', 16);
    assertUniqueValueCount('common habit description', 9);
    assertUniqueValueCount('functions notes', 16);
    assertUniqueValueCount('botanical description', 27);
    assertUniqueValueCount('crop notes', 7);
    assertUniqueValueCount('classification references', 5);
    assertUniqueValueCount('environmental references', 6);
    assertUniqueValueCount('native range', 29);
    assertUniqueValueCount('native environment', 14);
    assertUniqueValueCount('ecosystems references', 9);
    assertUniqueValueCount('uses intro', 3);
    assertUniqueValueCount('seed saving details', 6);
    assertUniqueValueCount('root zone', 3);
    assertUniqueValueCount('taxonomic rank', 2);
    assertUniqueValueCount('functions as', 8);
    assertUniqueValueCount('shelter notes', 4);
    assertUniqueValueCount('forage notes', 3);
    assertUniqueValueCount('material uses', 2);
    assertUniqueValueCount('heat zone', 3);
    assertUniqueValueCount('bulb type', 1);
    assertUniqueValueCount('graft rootstock', 2);
    assertUniqueValueCount('edible parts', 2);
    assertUniqueValueCount('edible uses', 3);
    assertUniqueValueCount('show cultivar group', 2);
    assertUniqueValueCount('cultivar group', 2);
    assertUniqueValueCount('is a variety', 2);
    assertUniqueValueCount('variety type', 1);
    assertUniqueValueCount('cultivar name', 1);
    assertUniqueValueCount('cultivar of', 1);
    assertUniqueValueCount('variety name', 0);
    assertUniqueValueCount('variety of', 0);
    assertUniqueValueCount('subspecies name', 0);
    assertUniqueValueCount('subspecies of', 0);
    assertUniqueValueCount('summary', 0);
    assertUniqueValueCount('cultivar group of', 1);
    assertUniqueValueCount('seed stratification instructions', 0);
    assertUniqueValueCount('graft details', 1);
    assertUniqueValueCount('bulb details', 1);
    assertUniqueValueCount('subspecific epithet', 2);
    assertUniqueValueCount('cultivar notes', 1);

    assertUniqueValueCount(['edible part and use', 'part used'], 26);
    assertUniqueValueCount(['edible part and use', 'preparation'], 22);
    assertUniqueValueCount(['edible part and use', 'part used for'], 48);
    assertUniqueValueCount(['edible part and use', 'part use details'], 90);

    assertUniqueValueCount(['material part and use', 'part used'], 26);
    assertUniqueValueCount(['material part and use', 'preparation'], 8);
    assertUniqueValueCount(['material part and use', 'part used for'], 95);
    assertUniqueValueCount(['material part and use', 'part use details'], 48);

    assertUniqueValueCount(['medicinal part and use', 'part used'], 24);
    assertUniqueValueCount(['medicinal part and use', 'preparation'], 8);
    assertUniqueValueCount(['medicinal part and use', 'part used for'], 200);
    assertUniqueValueCount(['medicinal part and use', 'part use details'], 49);

    assertUniqueValueCount(['toxic parts', 'part'], 10);
    assertUniqueValueCount(['toxic parts', 'level'], 4);
    assertUniqueValueCount(['toxic parts', 'details'], 14);
    assertUniqueValueCount(['toxic parts', 'compounds'], 18);

    assertUniqueValueCount(['functions', 'function'], 16);
    assertUniqueValueCount(['functions', 'details'], 19);

    assertUniqueValueCount(['shelter', 'shelter'], 2);
    assertUniqueValueCount(['shelter', 'details'], 2);

    assertUniqueValueCount(['forage', 'forage'], 8);
    assertUniqueValueCount(['forage', 'details'], 7);

    assertUniqueValueCount(['crops', 'part of plant'], 5);
    assertUniqueValueCount(['crops', 'harvest'], 12);
    assertUniqueValueCount(['crops', 'requires processing'], 4);
    assertUniqueValueCount(['crops', 'is storable'], 4);
    assertUniqueValueCount(['crops', 'storage'], 7);

    assertUniqueValueCount(['subspecies', 'rank'], 1);
    assertUniqueValueCount(['subspecies', 'name'], 2);
    assertUniqueValueCount(['subspecies', 'synonyms'], 2);
    assertUniqueValueCount(['subspecies', 'common names'], 3);
    assertUniqueValueCount(['subspecies', 'cultivar groups'], 0);
    assertUniqueValueCount(['subspecies', 'details'], 1);

    assertUniqueValueCount(['cultivar groups', 'name'], 1);
    assertUniqueValueCount(['cultivar groups', 'common names'], 1);
    assertUniqueValueCount(['cultivar groups', 'details'], 0);

    assertUniqueValueCount(['ungrouped cultivars', 'name'], 1);
    assertUniqueValueCount(['ungrouped cultivars', 'description'], 1);
  });

  it('normalized data passes integrity checks', () => {
    assert.equal(crops.length, 7414);

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
});
