const { assert } = require('chai');
const practicalplants = require('../../db/practicalplants.js');

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
    if (practicalplants.ARRAY_PROPERTIES.includes(property)) {
      const array = isFunctionsPropertyOfUnnormalizedObject(
        property,
        allowedValues
      )
        ? object[property]['function']
        : object[property];
      assert.isTrue(
        practicalplants
          .getAsArray(array)
          .every(value => allowedValues.includes(value)),
        JSON.stringify(array)
      );
    } else if (practicalplants.NUMBER_PROPERTIES.includes(property)) {
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
      allowedValues === practicalplants.ALL_FUNCTIONS_VALUES
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
    for (const property of practicalplants.NAME_PROPERTIES) {
      if (object[property]) {
        assert.isTrue(/[a-zA-Z]/.test(object[property][0]), object[property]);
        assert.isTrue(
          object[property][0] === object[property][0].toUpperCase(),
          object[property]
        );
      }
    }
  }

  let practicalplantsCrops;
  let crops;

  before(() => {
    practicalplantsCrops = require('../../db/practicalplants-data.js');
    crops = practicalplants.readCrops();
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

  it('basic checks', () => {
    assert.equal(practicalplantsCrops.length, 7416);

    practicalplantsCrops.forEach(crop => {
      assert.isNotNull(crop);
      assert.equal(typeof crop, 'object');

      Object.keys(crop).forEach(property =>
        assert.isTrue(
          practicalplants.ALL_PROPERTIES.includes(property),
          'Unknown property: ' + property
        )
      );
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
      updateMissingCount(
        missingCounts,
        object,
        'functions',
        practicalplants.ALL_FUNCTIONS_VALUES
      );
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
    assert.equal(missingCounts['functions'], 6964);
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
          practicalplants.PP_PROPERTIES.includes(property),
          'Unknown property "' + property + '"'
        )
      );

      assertValueOrMissing(
        object,
        'hardinessZone',
        practicalplants.PP_HARDINESS_ZONE_VALUES
      );
      assertValueOrMissing(
        object,
        'soilTexture',
        practicalplants.PP_SOIL_TEXTURE_VALUES
      );
      assertValueOrMissing(object, 'soilPh', practicalplants.PP_SOIL_PH_VALUES);
      assertValueOrMissing(
        object,
        'soilWaterRetention',
        practicalplants.PP_SOIL_WATER_RETENTION_VALUES
      );
      assertValueOrMissing(object, 'shade', practicalplants.PP_SHADE_VALUES);
      assertValueOrMissing(object, 'sun', practicalplants.PP_SUN_VALUES);
      assertValueOrMissing(object, 'water', practicalplants.PP_WATER_VALUES);
      assertValueOrMissing(
        object,
        'drought',
        practicalplants.PP_DROUGHT_VALUES
      );
      assertValueOrMissing(
        object,
        'poorNutrition',
        practicalplants.PP_BOOLEAN_VALUES
      );
      assertValueOrMissing(object, 'wind', practicalplants.PP_BOOLEAN_VALUES);
      assertValueOrMissing(
        object,
        'maritime',
        practicalplants.PP_BOOLEAN_VALUES
      );
      assertValueOrMissing(
        object,
        'pollution',
        practicalplants.PP_BOOLEAN_VALUES
      );
      assertValueOrMissing(
        object,
        'ecosystemNiche',
        practicalplants.PP_ECOSYSTEM_NICHE_VALUES
      );
      assertValueOrMissing(
        object,
        'lifeCycle',
        practicalplants.PP_LIFE_CYCLE_VALUES
      );
      assertValueOrMissing(
        object,
        'herbaceousOrWoody',
        practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES
      );
      assertValueOrMissing(
        object,
        'deciduousOrEvergreen',
        practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES
      );
      assertValueOrMissing(
        object,
        'growthRate',
        practicalplants.PP_GROWTH_RATE_VALUES
      );
      assertValueOrMissing(
        object,
        'matureMeasurementUnit',
        practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES
      );
      assertValueOrMissing(
        object,
        'matureHeight',
        practicalplants.PP_MATURE_HEIGHT_VALUES
      );
      assertValueOrMissing(
        object,
        'matureWidth',
        practicalplants.PP_MATURE_WIDTH_VALUES
      );
      assertValueOrMissing(
        object,
        'flowerType',
        practicalplants.PP_FLOWER_TYPE_VALUES
      );
      assertValueOrMissing(
        object,
        'pollinators',
        practicalplants.PP_POLLINATORS_VALUES
      );
      assertValueOrMissing(
        object,
        'functions',
        practicalplants.PP_FUNCTIONS_VALUES
      );
      assertValueOrMissing(
        object,
        'growFrom',
        practicalplants.PP_GROW_FROM_VALUES
      );
      assertValueOrMissing(
        object,
        'cuttingType',
        practicalplants.PP_CUTTING_TYPE_VALUES
      );
      assertValueOrMissing(
        object,
        'fertility',
        practicalplants.PP_FERTILITY_VALUES
      );
      assertValueOrMissing(
        object,
        'rootZone',
        practicalplants.PP_ROOT_ZONE_VALUES
      );
      assertValueOrMissing(object, 'family', practicalplants.PP_FAMILY_VALUES);
      assertValueOrMissing(object, 'genus', practicalplants.PP_GENUS_VALUES);

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
          practicalplants.ALL_SOIL_PH_VALUES
        );
        assertArrayPropertyOfRangeHasAllValuesInBetween(
          object.soilTexture,
          practicalplants.ALL_SOIL_TEXTURE_VALUES
        );
        assertArrayPropertyOfRangeHasAllValuesInBetween(
          object.soilWaterRetention,
          practicalplants.ALL_SOIL_WATER_RETENTION_VALUES
        );
      }
    });
  }).timeout(0);

  it('no duplicates in enum definitions', () => {
    assertNoDuplicates(practicalplants.PP_BOOLEAN_VALUES);
    assertNoDuplicates(practicalplants.PP_SOIL_TEXTURE_VALUES);
    assertNoDuplicates(practicalplants.PP_SOIL_WATER_RETENTION_VALUES);
    assertNoDuplicates(practicalplants.PP_SHADE_VALUES);
    assertNoDuplicates(practicalplants.PP_SUN_VALUES);
    assertNoDuplicates(practicalplants.PP_WATER_VALUES);
    assertNoDuplicates(practicalplants.PP_DROUGHT_VALUES);
    assertNoDuplicates(practicalplants.PP_ECOSYSTEM_NICHE_VALUES);
    assertNoDuplicates(practicalplants.PP_LIFE_CYCLE_VALUES);
    assertNoDuplicates(practicalplants.PP_HERBACEOUS_OR_WOODY_VALUES);
    assertNoDuplicates(practicalplants.PP_DECIDUOUS_OR_EVERGREEN_VALUES);
    assertNoDuplicates(practicalplants.PP_GROWTH_RATE_VALUES);
    assertNoDuplicates(practicalplants.PP_MATURE_MEASUREMENT_UNIT_VALUES);
    assertNoDuplicates(practicalplants.PP_FLOWER_TYPE_VALUES);
    assertNoDuplicates(practicalplants.PP_POLLINATORS_VALUES);
    assertNoDuplicates(practicalplants.PP_FUNCTIONS_VALUES);
    assertNoDuplicates(practicalplants.PP_FUNCTIONS_VALUES);
    assertNoDuplicates(practicalplants.PP_GROW_FROM_VALUES);
    assertNoDuplicates(practicalplants.PP_CUTTING_TYPE_VALUES);
    assertNoDuplicates(practicalplants.PP_FERTILITY_VALUES);
    assertNoDuplicates(practicalplants.PP_ROOT_ZONE_VALUES);
    assertNoDuplicates(practicalplants.PP_FAMILY_VALUES);
    assertNoDuplicates(practicalplants.PP_GENUS_VALUES);
    assertNoDuplicates(practicalplants.PP_SALINITY_VALUES);
  });
});
