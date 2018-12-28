# powerplant

<img style="float: right;" src="/dist/images/logo/logo_128.png">


Optimize your garden plan, and learn about permaculture in the process! powerplant provides intelligent planting suggestions which maximize positive crop interaction for the mutual benefit of all your crops. It also helps you track the progress of your garden with planting schedules and customizable tasks.

## Status

Currently in development. A good amount of research and specification work has been done the basic functionalities have been implemented and the minimum viable product can be used [here.](http://powerplant.ecohackerfarm.org/)

[Read more about it.](https://wiki.ecohackerfarm.org/powerplant:start)

## Setup

### Development Setup

[Setup Documentation](https://ecohackerfarm.github.io/powerplant/generated/index.html#toc1__anchor)

### Production Setup

For Production you need an installed MongoDB and a user that has access to a db in it ("readWrite", "dbAdm").
Also you need Node 6.x installed on the system.

1. `git clone https://github.com/Ecohackerfarm/powerplant.git`
2. `cd powerplant && npm install --only=production`
3. Setup Secrets in secrets.js:
	1. generate a private key (long random number) and set it for `JWT_SECRET`
	2. get a Google Geocode API key and set is as `GOOGLE_GEOCODE_API_KEY`
	3. set all `DATABASE_` variables
	4. set PP_PORT for the port you want powerplant to run
4. `npm run production`
5. `npm run migrate_production`
6. Done!

If you have any problems to set it up, send us an email to franz}at{ecohackerfarm.org
