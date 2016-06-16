var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;
var Build = dbschema.Build;

/* GET /builds listing. */
router.get('/', function(req, res, next) {
  Build.find(function (err, builds) {
    if (err) return next(err);
    res.json(builds);
  });
});

/* POST /builds */
router.post('/', function(req, res, next) {
  var newBuild = new Build(req.body);
  newBuild.save(function(err){
      if (err) return next(err);
  }); 
  res.json(newBuild);

});

/* POST /builds  + property */
router.post('/:id', function(req, res, next) {
    Build.findById(req.params.id)
    .exec(function(err,env){
        if (err) return next(err);
        env.properties.push (req.body);
        env.save(function(err){
            if (err) return next(err);
            res.json(env);
        })    
    }); 
});


/* GET /builds/id */
router.get('/:id', function(req, res, next) {
  Build.findById(req.params.id)
     .populate("application")
    .exec(function (err, post) {
    if (err) return next(err);
    res.json(post);
  });    
});

/* PUT /builds/:id */
// Do we need this ?
// router.put('/:id', function(req, res, next) {
//   Build.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

/* DELETE /builds/:id */
router.delete('/:id', function(req, res, next) {
  Build.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
