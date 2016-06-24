var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');

var async = require('async')

var Environment = dbschema.Environment;

/* Gets all environments. */
router.get('/', function(req, res, next) {
    async.waterfall([
        function (callback){
            Environment.find(callback)
        }
    ],function (err, environments){
        if (err) return next(err);
        res.json(environments);
    })
});

/* Create a environment */
// Check duplicate on name
router.post('/', function(req, res, next) {
    async.waterfall([
        function (callback){
            if (req.body.name){
                Environment.findOne({ 'name': req.body.name }, 'name', callback)
            }else{
                res.status(HTTPStatus.BAD_REQUEST).json({"reason": "Name is not set in the payload"})
            }
        }
    ],function (err, environment){
        if (err) return handleError(err);
        if (environment) {res.status(HTTPStatus.NOT_MODIFIED).end(); }
        var newEnvironment = new Environment(req.body);
        newEnvironment.save(function(err){
            if (err) return next(err);
            res.json(newEnvironment);
        });
    });
});

/* Updates the environment by id*/
// Todo: check duplicate before update the environment name?
router.put('/id/:id', function(req, res, next) {
    async.waterfall([
        function (callback) {
            var newEnvironment = new Environment(req.body);
            Environment.findByIdAndUpdate(req.params.id, newEnvironment, callback)
        }
    ],function (err, environment){
        if (err) return next(err);
        res.json(environment);
    });
});

/* Delete the environments by id */
// Todo: delete all deployments for the environment
router.delete('/id/:id', function(req, res, next) {
    async.waterfall([
        function (callback){
            Environment.findByIdAndRemove(req.params.id, callback);
        }
    ], function (err, environment){
        if (err) return next(err);
        res.json(environment)
    });
});

module.exports = router;
