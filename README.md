# powerplant

Optimize your garden plan, and learn about permaculture in the process! powerplant provides intelligent planting suggestions which maximize positive crop interaction for the mutual benefit of all your crops. It also helps you track the progress of your garden with planting schedules and customizable tasks.

Status
======

Currently in very early stage. A good amount of research and specification work
has been done but basic functionalities have not been implemented yet.

[Read more about it.](https://wiki.ecohackerfarm.org/companion_planting)

Setup
=====

To start, you need to set up the development environment. This includes:
NodeJS, Docker (with mongo db)

1.  [Install Node](https://nodejs.org/en/download/package-manager/) you
    should install version 6.x
2.  [Install
    Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#install-using-the-repository)
3.  Install the [Mongo Docker image](https://hub.docker.com/_/mongo/) by
    running `docker pull mongo`
4.  Clone the [git
    repository](https://github.com/Ecohackerfarm/powerplant.git)
5. run `npm install` to get all packages installed
6. generate a private key and export it as a string in
   `/jwt-secret.js`
   ex: `export default 'random-string-comes-here'`
7.  Start the Docker image by running `npm run mongo`
8.  Run 'npm start'
9.  Run the Firebase data migration by running `npm run migrate`
10.  At this point, everything should be set up. Run `npm test` to make
    sure everything is working, and `npm start` to begin serving the
    website on `http://localhost:8080`
11. Done!

The project may not run properly after reboot because it fails to
connect to the database. Running `docker restart pp_main` fixes the
issue.

[More documentation](https://github.com/Ecohackerfarm/powerplant/tree/master/docs)
