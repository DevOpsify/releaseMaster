var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Environments = dbschema.Environments;

/* GET /environments listing. */
router.get('/', function(req, res, next) {
    Environment.find(function (err, environments) {
        if (err) return next(err);
        res.json(environments);
    });
});

/* POST /environments */
// Check duplicate on name
router.post('/', function(req, res, next) {
    console.log(req.body);
    Environment.findOne({ 'name': req.body.name }, 'name ', function (err, environment) {
        if (err) return handleError(err);
        if (environment) {
            console.log("duplicate");
            res.json(environment);
        }
        else
        {
            var newEnvironment = new Environment(req.body);
            newEnvironment.save(function(err){
                if (err) return next(err);
            });
            res.json(newEnvironment);
        }
    });
});

/* PUT /environments/:id */
// Todo: check duplicate before update the environment name?
router.put('/:id', function(req, res, next) {
    Environment.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /environments/:id */
// Todo: delete all deployments for the environment
router.delete('/:id', function(req, res, next) {
    Build.find({application: req.params.id}).remove().exec(function(err){
        Environment.findByIdAndRemove(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });
});

module.exports = router;
