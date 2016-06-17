[![Build Status](https://travis-ci.org/DevOpsify/releaseMaster.svg?branch=master)](https://travis-ci.org/DevOpsify/releaseMaster)


# Release Master

Release Master provide insign on your release cycle for all the different environment you have


## Build local image and test app with local image

```
make build-local
make start-local
```

## Build image and push to docker hub

```
make build
make push
```

## Start app with image from docker hub

```
make start
```


## Start the development environment

### Start Mongo DB in docker

```
# docker run --name mongodb -p 27017:27017 -d mongo
 
# export mongodb=192.168.99.100 # docke machine IP
```


### Start the Node.JS application

```
1. Install bower if you don't have it locally using sudo npm install -g bower
2. npm install
3. bower install
4. npm start
```


## [APIs] definition

[APIs]: <https://github.com/DevOpsify/releaseMaster/blob/master/APIs.md>

