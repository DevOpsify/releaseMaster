var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Build = dbschema.Build;
var Application = dbschema.Application;

/* Gets all builds */
router.get('/', function(req, res, next) {
 if (req && req.query && req.query.application){
    Application.findOne( {'name': req.query.application }, function (err, application) {
        if (application){
            Build.find({"application":application.id}, function (err, builds) {
                if (err) return next(err);
                res.json(builds);
            });
        }else{
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


/* Gets all builds for application*/
router.get('/all/:application', function(req, res, next) {
  Application.findOne( {'name': req.params.application }, function(err,application){
    if (err) return next(err);
    if (application==null) {
        console.log("application not found");
        res.end();
        return;
    };
    queryString={application: application._id }
    if (typeof req.query.branch !== 'undefined' && req.query.branch) {
      queryString.gitBranch= req.query.branch;
    }
    Build.find (queryString)
    .sort({"created_at": -1})
    .exec(function (err, builds) {
      if (err) return next(err);
      res.json(builds);
    });
  });
});


/* GET latest build for application. */
/* Usage
// GET /api/{applicationName}/latest?q=docker&branch={branch}
*/
router.get('/latest/:application', function(req, res, next) {
  Application.findOne( {'name': req.params.application }, function(err,application){
    if (err) return next(err);
    if (application==null) {
        console.log("application not found");
        res.end();
        return;
    };
    queryString={application: application._id }
    if (typeof req.query.branch !== 'undefined' && req.query.branch) {
      queryString.gitBranch= req.query.branch;
    }
    Build.find (queryString)
    .sort({"created_at": -1})
    .limit(1)
    .exec(function (err, build) {
      if (err) return next(err);
      if (build.length==0) {
        var res_json = {
            "reason": "build not found with criteria"
        }
        res.status(400).json(res_json);
        return;
      };
      switch (req.query.q) {
        case "docker":
          res.send(build[0].dockerDigest);
          break;
        case "git":
          res.send(build[0].gitSHA);
          break;
        case "branch":
          res.send(build[0].gitBranch);
          break;
        case "timestamp":
          res.send(build[0].created_at);
          break;
        default: res.json(build[0]);
      }
    });
  });
});

module.exports = router;
