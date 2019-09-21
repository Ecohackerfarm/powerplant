const weather = require('../../shared/weather');
const DarkSky = require('dark-sky');
const { assert } = require('chai');
const sinon = require('sinon');

const warningResult = [
  {
    title: 'Severe Thunderstorm Watch',
    regions: [],
    severity: 'warning',
    time: 1568497500,
    expires: 1568523600,
    description:
      'SEVERE THUNDERSTORM WATCH 653 IS IN EFFECT UNTIL 1100 PM MDT FOR THE FOLLOWING LOCATIONS AZ . ARIZONA COUNTIES INCLUDED ARE GILA MARICOPA PINAL\n',
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
        '...A DUST STORM WARNING REMAINS IN EFFECT UNTIL 600 PM MST FOR MARICOPA COUNTY... At 544 PM MST, a wall of dust was along a line extending from near Bosque to 10 miles southeast of Gila Bend Auxiliary Field to 13 miles south of Big Horn, moving southwest at 20 mph. HAZARD...Less than one quarter mile visibility with strong wind in excess of 40 mph. SOURCE...Doppler radar. IMPACT...Dangerous life-threatening travel. This includes the following highways... AZ Interstate 8 between mile markers 110 and 137. AZ Route 238 between mile markers 1 and 13. AZ Route 85 between mile markers 1 and 18, and between mile markers 119 and 128. Locations impacted include... Gila Bend, Gila Bend Auxiliary Field, Bosque, Sonoran National Monument and Big Horn. PRECAUTIONARY/PREPAREDNESS ACTIONS... Dust storms lead to dangerous driving conditions with visibility reduced to near zero. If driving, avoid dust storms if possible. If caught in one, then pull off the road, turn off your lights and keep your foot off the brake. Motorists should not drive into a dust storm. PULL ASIDE STAY ALIVE! To report severe weather, contact the National Weather Service, or your nearest law enforcement agency, who will relay your report to the National Weather Service office in Phoenix.\n',
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
        'SEVERE THUNDERSTORM WATCH 653 IS IN EFFECT UNTIL 1100 PM MDT FOR THE FOLLOWING LOCATIONS AZ . ARIZONA COUNTIES INCLUDED ARE GILA MARICOPA PINAL\n',
      uri:
        'https://alerts.weather.gov/cap/wwacapget.php?x=AZ125D1044F8D4.SevereThunderstormWatch.125D1051BA10AZ.WNSWOU3.a280bfa72037154722cac46333caf45b'
    }
  ]
};

describe('get weather warning', () => {
  it('maricopa county', async () => {
    const darkskystub = sinon.stub(DarkSky.prototype, 'coordinates').returns({
      exclude: sinon.stub().returns({
        get: sinon.stub().resolves(weatherResult)
      })
    });

    const response = await weather.getWeatherWarnings({
      lat: 33.0435719,
      lng: -112.0667759
    });

    assert.equal(darkskystub.calledOnce, true);
    assert.deepEqual(response, warningResult);
  });
});
