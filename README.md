[![Build Status](https://travis-ci.org/DevOpsify/releaseMaster.svg?branch=master)](https://travis-ci.org/DevOpsify/releaseMaster)


# Release Master

Release Master provide insign on your release cycle for all the different environment you have



## Start everything container

1. docker-compose up -d
2. access via localhost:3000 ( or docker-machine ip:3000 if using docker machine)

tl;dr
## Start node development locally

### Start DB
```
# docker run --name mongodb -p 27017:27017 -d mongo
 
# export mongodb=192.168.99.100 # docke machine IP
```


### Run App

```
1. Install bower if you don't have it locally using sudo npm install -g bower
2. npm install
3. bower install
4. npm start
```


## Usage

### Add application

```
POST /applications 
{
  "name": "ReleaseMaster",
  "description": "This is a description"
}
```


### List all applications

```
GET /applications
```

### Get all builds for application

```
GET /applications/{applicationName}
```

### Add build

```
POST /builds
{
  "application": "0",
  "gitRepo": "git@github.com/test",
  "gitSHA": "1111abcd1234",
  "gitBranch": "master",
  "dockerDigest": "sha256:12345678"
}
```


### Query latest build for application

```
GET /api/{applicationName}/latest?q=docker&branch={branch}

```

### Query all buildz for application

```
GET /api/{applicationName}/all?q=docker&branch={branch}

```



