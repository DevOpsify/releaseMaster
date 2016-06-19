[![Build Status](https://travis-ci.org/DevOpsify/releaseMaster.svg?branch=master)](https://travis-ci.org/DevOpsify/releaseMaster)


# Release Master

Release Master provide insign on your release cycle for all the different environment you have


### Build local image and test app with local image

```
# Requires docker-compose v1.7+
$ make start-local
```

### Build image and push to docker hub

```
$ make build
$ make push
```

### Start app with image from docker hub

```
$ make start
```


### Start the development environment

- Start Mongo DB in docker

```
$ docker run --name mongodb -p 27017:27017 -d mongo
$ export mongodb=192.168.99.100 # docke machine IP
```


- install npm packages and bower packages

```
$ npm install
$ bower install
```

- Start node.js application

with npm

```
$ npm start
```

or with nodemon

```
$ npm install nodemon -g
$ nodemon bin/www
```

## [EendPoints] definition

[EndPoints]: <https://github.com/DevOpsify/releaseMaster/blob/master/EndPoints.md>

