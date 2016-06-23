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

module.exports = router;
