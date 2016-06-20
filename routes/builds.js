var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Build = dbschema.Build;
var Application = dbschema.Application;

/* Gets all builds */
router.get('/', function(req, res, next) {
  Build.find(function (err, builds) {
    if (err) return next(err);
    res.json(builds);
  });
});

/* Creates a build */
router.post('/', function(req, res, next) {
  /* Make sure application id exists */
  Application.findById(req.body.application, function(err, application){
    if (err) return next(err);
    if (application) {
      var newBuild = new Build(req.body);
      newBuild.save(function(err){
        if (err) return next(err);
      });
      res.json(newBuild);
    }else{
      var res_json = {
        "reason": "Can not find application with id " + req.body.application
      }
      res.status(400).json(res_json);
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
