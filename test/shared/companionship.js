const { assert } = require('chai');
const { companions } = require('../../db/matrix.js');
const companionship = require('../../shared/companionship.js');
const Crop = require('../../shared/crop.js');
const PracticalplantsCrop = require('../../shared/practicalplants-crop.js');

describe('Companionship algorithm', () => {
  let crops;
  let binomialNameToCrop;

  before(() => {
    crops = PracticalplantsCrop.convertToCrops(require('../../db/practicalplants-data.js'));
    binomialNameToCrop = Crop.mapCropsByBinomialName(crops);
  });

  it('is compatible with the companion plant matrix', () => {
    let count = 0;
    companions.forEach(entry => {
      if (entry.companion > 0) {
        /* Crops that are marked as companions in the companion plant
         * matrix should also be determined as compatible by the
         * companionship algorithm, on the other hand incompatibility in
         * the matrix doesn't imply incompatibility in the algorithm. */
        cropNames = [entry.plant0, entry.plant1];
        cropObjects = cropNames.map(name => binomialNameToCrop[name]);

        if (!companionship.areCompatible(cropObjects)) {
          count++;

          console.log(cropNames);
          console.log(cropObjects[0]);
          console.log(cropObjects[1]);
        }
      }
    });
    assert.equal(
      count,
      0,
      count + '/' + companions.length + ' incompatible pairs found'
    );
  });

  it('compatibility values all return boolean', () => {
    companionship.compatibilityValues.forEach(compatibilityFunction => {
      assert.isTrue(
        [false, true].includes(
          compatibilityFunction([crops[0], crops[1], crops[2]])
        )
      );
    });
  });

  it('goodness values all return number between 0 and 1 inclusive', () => {
    companionship.goodnessValues.forEach(goodnessValue => {
      const value = goodnessValue.goodnessFunction([
        crops[0],
        crops[1],
        crops[2]
      ]);
      assert.isTrue(0 <= value && value <= 1);
    });
  });

  it('isSoilTextureCompatible()', () => {
    const crop0 = {
      soilTexture: ['sandy', 'loamy', 'clay']
    };
    const crop1 = {
      soilTexture: ['clay', 'heavy clay']
    };
    const crop2 = {
      soilTexture: ['heavy clay']
    };

    assert.equal(
      companionship.isSoilTextureCompatible([crop0, crop1, crop2]),
      false
    );
    assert.equal(companionship.isSoilTextureCompatible([crop0, crop1]), true);
    assert.equal(companionship.isSoilTextureCompatible([crop0, crop2]), false);
    assert.equal(companionship.isSoilTextureCompatible([crop1, crop2]), true);
    assert.equal(companionship.isSoilTextureCompatible([crop0]), true);
    assert.equal(companionship.isSoilTextureCompatible([crop1]), true);
    assert.equal(companionship.isSoilTextureCompatible([crop2]), true);
  });

  it('isSoilPhCompatible()', () => {
    const crop0 = {
      soilPh: ['very acid', 'acid', 'neutral']
    };
    const crop1 = {
      soilPh: ['neutral', 'alkaline', 'very alkaline']
    };
    const crop2 = {
      soilPh: ['very alkaline']
    };

    assert.equal(
      companionship.isSoilPhCompatible([crop0, crop1, crop2]),
      false
    );
    assert.equal(companionship.isSoilPhCompatible([crop0, crop1]), true);
    assert.equal(companionship.isSoilPhCompatible([crop0, crop2]), false);
    assert.equal(companionship.isSoilPhCompatible([crop1, crop2]), true);
    assert.equal(companionship.isSoilPhCompatible([crop0]), true);
    assert.equal(companionship.isSoilPhCompatible([crop1]), true);
    assert.equal(companionship.isSoilPhCompatible([crop2]), true);
  });

  it('isSoilWaterRetentionCompatible()', () => {
    const crop0 = {
      soilWaterRetention: ['well drained', 'moist']
    };
    const crop1 = {
      soilWaterRetention: ['moist', 'wet']
    };
    const crop2 = {
      soilWaterRetention: ['wet']
    };

    assert.equal(
      companionship.isSoilWaterRetentionCompatible([crop0, crop1, crop2]),
      false
    );
    assert.equal(
      companionship.isSoilWaterRetentionCompatible([crop0, crop1]),
      true
    );
    assert.equal(
      companionship.isSoilWaterRetentionCompatible([crop0, crop2]),
      false
    );
    assert.equal(
      companionship.isSoilWaterRetentionCompatible([crop1, crop2]),
      true
    );
    assert.equal(companionship.isSoilWaterRetentionCompatible([crop0]), true);
    assert.equal(companionship.isSoilWaterRetentionCompatible([crop1]), true);
    assert.equal(companionship.isSoilWaterRetentionCompatible([crop2]), true);
  });

  it('isWaterCompatible()', () => {
    const crop0 = {
      water: 'aquatic'
    };
    const crop1 = {
      water: 'low'
    };
    const crop2 = {
      water: 'high'
    };

    assert.equal(companionship.isWaterCompatible([crop0, crop0]), true);
    assert.equal(companionship.isWaterCompatible([crop0, crop1]), false);
    assert.equal(companionship.isWaterCompatible([crop0, crop2]), false);
    assert.equal(companionship.isWaterCompatible([crop1, crop2]), true);
  });

  it('isSunCompatible()', () => {
    const crop0 = {
      sun: 'indirect sun'
    };
    const crop1 = {
      sun: 'full sun'
    };

    assert.equal(companionship.isSunCompatible([crop0, crop1]), true);
  });

  it('isShadeCompatible()', () => {
    const crop0 = {
      shade: 'no shade'
    };
    const crop1 = {
      shade: 'permanent deep shade'
    };

    assert.equal(companionship.isShadeCompatible([crop0, crop1]), true);
  });

  it('isHardinessZoneCompatible()', () => {
    const crop0 = {
      hardinessZone: 0
    };
    const crop1 = {
      hardinessZone: 6
    };
    const crop2 = {
      hardinessZone: 7
    };
    const crop3 = {
      hardinessZone: 8
    };
    const crop4 = {
      hardinessZone: 1
    };

    assert.equal(companionship.isHardinessZoneCompatible([crop0, crop0]), true);
    assert.equal(
      companionship.isHardinessZoneCompatible([crop0, crop1, crop2]),
      true
    );
    assert.equal(
      companionship.isHardinessZoneCompatible([crop0, crop2, crop3]),
      true
    );
    assert.equal(
      companionship.isHardinessZoneCompatible([crop0, crop1, crop3]),
      true
    );
    assert.equal(
      companionship.isHardinessZoneCompatible([crop3, crop4]),
      false
    );
  });

  it('isDroughtCompatible()', () => {
    const crop0 = {
      drought: 'dependent'
    };
    const crop1 = {
      drought: 'tolerant'
    };
    const crop2 = {
      drought: 'intolerant'
    };

    assert.equal(companionship.isDroughtCompatible([crop0, crop0]), true);
    assert.equal(companionship.isDroughtCompatible([crop0, crop1]), true);
    assert.equal(companionship.isDroughtCompatible([crop0, crop2]), false);
    assert.equal(companionship.isDroughtCompatible([crop1, crop2]), true);
  });

  it('getFunctionsDiversity()', () => {
    const crop0 = {
      functions: ['nitrogen fixer', 'ground cover', 'hedge']
    };
    const crop1 = {
      functions: ['windbreak', 'pioneer', 'earth stabilizer']
    };

    assert.equal(companionship.getFunctionsDiversity([crop0, crop1]), 0.4);
  });

  it('getFlowerTypeDiversity()', () => {
    const crop0 = {
      flowerType: 'hermaphrodite'
    };
    const crop1 = {
      flowerType: 'hermaphrodite'
    };

    assert.equal(
      companionship.getFlowerTypeDiversity([crop0, crop1]).toFixed(3),
      0.333
    );
  });
});
