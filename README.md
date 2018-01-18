# powerplant

![powerplant Logo](/images/dist/images/logo/logo_128.png)


Optimize your garden plan, and learn about permaculture in the process! powerplant provides intelligent planting suggestions which maximize positive crop interaction for the mutual benefit of all your crops. It also helps you track the progress of your garden with planting schedules and customizable tasks.

## Status

Currently in development. A good amount of research and specification work has been done the basic functionalities have been implemented and the minimum viable product can be used [here.](http://powerplant.ecohackerfarm.org/)

[Read more about it.](https://wiki.ecohackerfarm.org/powerplant:start)

## Setup

### Development

To start developing, you need to set up the development environment. This includes:
NodeJS and MongoDB or Docker with MongoDB

1.  [Install Node](https://nodejs.org/en/download/package-manager/) you
    should install version 6.x
2.  [Install
    Docker](https://docs.docker.com/engine/installation)
3.  Install the [Mongo Docker image](https://hub.docker.com/_/mongo/) by running `docker pull mongo`
4.  Clone the [git
    repository](https://github.com/Ecohackerfarm/powerplant.git)
5. run `npm install` to get all packages installed
6. generate a private key and and set it for JWT_SECRET and get a Google Geocode API key and set is as GOOGLE_GEOCODE_API_KEY into secret.js(see secrets.example.js)
7.  Start the Docker image by running `npm run mongo`
8.  Run 'npm start'
9.  Run the Firebase data migration by running `npm run migrate`
10. At this point, everything should be set up. Run `npm test` to make
    sure everything is working, and `npm start` to begin serving the
    website on `http://localhost:8080`
11. Done!

The project may not run properly after reboot because it fails to 
connect to the database. Running `docker restart pp_main` fixes the
issue.

[More documentation](https://github.com/Ecohackerfarm/powerplant/tree/master/docs)

### Production

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
5. `npm run migrate_production'
6. Done!

If you have any problems to set it up, send us an email to franz}at{ecohackerfarm.org
