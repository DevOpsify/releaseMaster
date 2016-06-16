var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;
var Build = dbschema.Build;

/* GET /environments listing. */
router.get('/', function(req, res, next) {
  Environment.find(function (err, environments) {
    if (err) return next(err);
    res.json(environments);
  });
});

/* POST /environments */
router.post('/', function(req, res, next) {
    Environment.findOne({ name: req.body.name , application:req.body.application},  function (err, environment) {
        if (err) return next(err);
        if (environment)
        {
            console.log("duplicate");
            res.json(null);
        }else{
            Environment.create(req.body, function (err, post) {
                if (err) return next(err);
                res.json(post);
            });             
        }
    });
});

/* POST /environments  + property */
router.post('/:id', function(req, res, next) {
    Environment.findById(req.params.id)
    .exec(function(err,env){
        if (err) return next(err);
        env.properties.push (req.body);
        env.save(function(err){
            if (err) return next(err);
            res.json(env);
        })    
    }); 
});


/* GET /environments/id */
router.get('/:id', function(req, res, next) {



  Environment.findById(req.params.id)
     .populate("application")
    .exec(function (err, post) {
    if (err) return next(err);
    res.json(post);
  });    
});

/* PUT /environments/:id */
router.put('/:id', function(req, res, next) {
  Environment.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /environments/:id */
router.delete('/:id', function(req, res, next) {
  Environment.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
