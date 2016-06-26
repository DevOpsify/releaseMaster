var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

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
 if (req && req.query && req.query.application){
   
    Application.findOne( {'name': req.query.application }, function (err, application) {
        if (application){
          var queryString={};
          queryString.application=application._id
          if (req.query.branch) {
            queryString.gitBranch= req.query.branch;
          }
          Build.find (queryString)
          .sort({"created_at": -1})
          .exec(function (err, builds) {
            if (err) return next(err);
            if (req.query.latest == "") {
              // lastes is defined, only get lastest one
              if (builds.length==0) {
                // Return empty array
                return builds;
              };
              switch (req.query.part) {
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
              return;
            }
            res.json(builds);
          });
        } else {
            var res_json = {
                "reason": "can not found application with name : " + req.query.application
            }
            res.status(HTTPStatus.NOT_FOUND).json(res_json);
            return
        }
    });
  }else{
    Build.find(function (err, builds) {
        if (err) return next(err);
        res.json(builds);
    });
  }
});

/* Creates a build */
router.post('/', function(req, res, next) {
  Application.findOne( {'name': req.body.application }, function(err,application){
    if (err) return next(err);
    if (application) {
      req.body.application= application.id;
      var newBuild = new Build(req.body);
      newBuild.save(function(err){
        if (err) return next(err);
      });
      res.json(newBuild);
    }else{
      var res_json = {
        "reason": "Can not find application with name " + req.body.application
      }
      res.status(HTTPStatus.BAD_REQUEST).json(res_json);
    }
  });
});

/* Gets a build by its id */
router.get('/id/:id', function(req, res, next) {
  Build.findById(req.params.id)
     .populate("application")
    .exec(function (err, build) {
    if (err) return next(err);
    res.json(build);
  });
});

/* DELETE /builds/:id */
router.delete('/id/:id', function(req, res, next) {
  Build.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
