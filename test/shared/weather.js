const { getFrostAndRainWarnings } = require('../../shared/weather');
const DarkSky = require('dark-sky');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const warningResult = [
  {
    title: 'Severe Thunderstorm Watch',
    regions: [],
    severity: 'warning',
    time: 1568497500,
    expires: 1568523600,
    description:
      'SEVERE THUNDERSTORM WATCH 653 IS IN EFFECT UNTIL 1100 PM MDT FOR THE FOLLOWING LOCATIONS AZ .',
    uri:
      'https://alerts.weather.gov/cap/wwacapget.php?x=AZ125D1044F8D4.SevereThunderstormWatch.125D1051BA10AZ.WNSWOU3.a280bfa72037154722cac46333caf45b'
  }
];

const weatherResult = {
  alerts: [
    {
      title: 'Dust Storm Warning',
      regions: [],
      severity: 'warning',
      time: 1568508240,
      expires: 1568509200,
      description:
        '...A DUST STORM WARNING REMAINS IN EFFECT UNTIL 600 PM MST FOR MARICOPA COUNTY...',
      uri:
        'https://alerts.weather.gov/cap/wwacapget.php?x=AZ125D105107F0.DustStormWarning.125D10511DD0AZ.PSRDSWPSR.47c41b635bbb74a8e7908d7e0e75f94c'
    },
    {
      title: 'Severe Thunderstorm Watch',
      regions: [],
      severity: 'warning',
      time: 1568497500,
      expires: 1568523600,
      description:
        'SEVERE THUNDERSTORM WATCH 653 IS IN EFFECT UNTIL 1100 PM MDT FOR THE FOLLOWING LOCATIONS AZ .',
      uri:
        'https://alerts.weather.gov/cap/wwacapget.php?x=AZ125D1044F8D4.SevereThunderstormWatch.125D1051BA10AZ.WNSWOU3.a280bfa72037154722cac46333caf45b'
    },
    {
      title: 'Flood Advisory',
      regions: [],
      severity: 'Advisory',
      time: 1568497500,
      expires: 1568523600,
      description: 'Heavy Rainfall...',
      uri:
        'https://alerts.weather.gov/cap/wwacapget.php?x=AK125D10AF0A58.FloodWarning.125D10BC14A0AK.AJKFLWAJK.325f37c37364cf0bc17e46f34bc9ae67 '
    }
  ]
};

describe('weather warning', () => {
  it('throw an error with no location', async () => {
    await assert.isRejected(getFrostAndRainWarnings(), 'must specify location');
  });

  it('throw an error with empty coordinate', async () => {
    await assert.isRejected(
      getFrostAndRainWarnings({}),
      'coordinates cannot be empty'
    );
  });

  it('throw an error with invalid arg', async () => {
    await assert.isRejected(
      getFrostAndRainWarnings([]),
      'location is not an address or a coordinate'
    );
  });

  it('get rain warning for a location', async () => {
    const darkskystub = sinon.stub(DarkSky.prototype, 'coordinates').returns({
      exclude: sinon.stub().returns({
        get: sinon.stub().resolves(weatherResult)
      })
    });

    const response = await getFrostAndRainWarnings({
      lat: 33.0435719,
      lng: -112.0667759
    });

    assert.equal(darkskystub.calledOnce, true);
    assert.deepEqual(response, warningResult);
  });
});
