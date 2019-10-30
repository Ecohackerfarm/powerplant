const { assert } = require('chai');
const Crop = require('../../shared/crop.js');

/**
 * @param {Object[]} values
 */
function assertNoDuplicates(values) {
  assert.equal(new Set(values).size, values.length, values);
}

describe('Crop', () => {
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
