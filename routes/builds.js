var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var async = require('async')
var moment = require('moment');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Build = dbschema.Build;
var Application = dbschema.Application;

/* Gets builds */
/*
GET /builds # return all builds
GET /builds?application=APP # return all builds for APP
GET /builds?application=APP&branch=master # return all builds for APP and branch master

GET /builds?application=APP&latest # return latest build for APP
GET /builds?application=APP&branch=master&latest # return latest builds for APP and branch master

GET /builds?application=APP&latest&part=[docker|git|branch|timestamp] # return latest build info for APP
GET /builds?application=APP&branch=master&latest&part=[docker|git|branch|timestamp] # return latest build info for APP and branch master
*/
router.get('/', function(req, res, next) {
  async.waterfall([
    function(callback){
       if (req.query.application){
          Application.findOne( {'name': req.query.application }, callback);
       }else {
          var res_json = {
            "reason": "missing parameter for application"
          }
          res.status(HTTPStatus.BAD_REQUEST).json(res_json);
          return
       }
    },
    function (application, callback){
      if (!application){
        var res_json = {
          "reason": "can not found application with name : " + req.query.application
        }
        res.status(HTTPStatus.NOT_FOUND).json(res_json);
        return
      }
      var query = Build.find({});
      query.where("application",application._id);
      if (req.query.branch) {
          query.where("gitBranch", req.query.branch);
      }
      query.sort({"created_at": -1})
      var retsize=parseInt(req.query.limit);
      if (retsize > 0)
        query.limit(retsize)
      else
        query.limit(10);
      query.exec(callback);
    }
  ], function (error, builds){
    if (error) return next(error);
    if (req.query.latest == "") {
      if (builds.length==0) return builds;
      switch (req.query.part) {
        case "uri":
          res.send(builds[0].artifactUri);
          break;
        case "docker":
          res.send(builds[0].dockerDigest);
          break;
        case "git":
          res.send(builds[0].gitSHA);
          break;
        case "branch":
          res.send(builds[0].gitBranch);
          break;
        case "timestamp":
          res.send(builds[0].created_at);
          break;
        default: res.json(builds[0]);
      }
    } else if(req.query.format =="jenkins"){
        var formatted_json ={}
        for(var i=0; i<builds.length;i++){
          formatted_json[builds[i].id]=builds[i].gitBranch+":"+moment(builds[i].created_at).fromNow()
        }
        res.json(formatted_json);
    }
    else{
      res.json(builds);
    }
  });
});

/* Creates a build */
router.post('/', function(req, res, next) {
  async.waterfall([
    function (callback){
      Application.findOne( {'name': req.body.application }, callback);
    },
    function (application, callback){
      if (application){
        req.body.application = application.id
        var newBuild = new Build(req.body);
        newBuild.save(callback);
      } else {
        var res_json = {
          "reason": "Can not find application with name " + req.body.application
        }
        res.status(HTTPStatus.BAD_REQUEST).json(res_json);
        return;
      }
    }
  ], function(error, build, test){
    if (error) return next(error);
    res.json(build);
  });
});

/* Gets a build by its id */
router.get('/id/:id', function(req, res, next) {
  async.waterfall([
    function (callback){
      Build.findById(req.params.id).populate("application").exec(callback)
    }
  ],function (error, build){
    switch (req.query.part) {
      case "uri":
        res.send(build.artifactUri);
        break;
      case "docker":
        res.send(build.dockerDigest);
        break;
      case "git":
        res.send(build.gitSHA);
        break;
      case "branch":
        res.send(build.gitBranch);
        break;
      case "timestamp":
        res.send(build.created_at);
        break;
      default: res.json(build);
    }
  });
});

/* DELETE /builds/:id */
router.delete('/id/:id', function(req, res, next) {
  async.waterfall([
    function (callback){
      Build.findByIdAndRemove(req.params.id, req.body, callback);
    }
  ],function (error, build){
    if(error) return next(error)
    res.json(build)
  });;
});

module.exports = router;
