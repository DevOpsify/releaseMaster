var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');

var async = require('async')

var Application = dbschema.Application;
var Build = dbschema.Build;

/* Gets all applications. */
router.get('/', function(req, res, next) {
    async.waterfall([
        function (callbacke){
            Application.find(callbacke);
        }
    ],function (err,applications){
        if (err) next (err);
        res.json(applications);
    });
});

/* Creates a new application */
router.post('/', function(req, res, next) {
    async.waterfall([
        function (callback){
            Application.findOne({ 'name': req.body.name }, 'name', callback);
        }
    ],function (err, application){
        if (err) return handleError(err);
        if (application) res.status(HTTPStatus.NOT_MODIFIED).end();
        var newApplication = new Application(req.body);
        newApplication.save(function(err){ if (err) return next(err); });
        res.json(newApplication);
    });
});

/* Gets application by name*/
router.get('/name/:name', function(req, res, next) {
    async.waterfall([
        function (callback){
            Application.findOne( {'name': req.params.name },callback);
        }
    ], function (err, application){
        if (err) return next(err);
        if (application){
            res.json(application);
        } else {
            res.status(HTTPStatus.NOT_FOUND).json({"reason":"Applicaion name not found"});
        }
    });
});

/* Gets the application by id*/
router.get('/id/:id', function(req, res, next){
     async.waterfall([
        function (callback){
            Application.findById(req.params.id, callback);
        }
     ],function (err, application){
        if (err) return next(err);
        if (application) { res.json(application); }
        res.status(HTTPStatus.NOT_FOUND).end();
     });
});


/* Updates the application by id */
// Todo: check duplicate before update the application name?
router.put('/id/:id', function(req, res, next) {
    async.waterfall([
        function (callback) {
            var newApplication = new Application(req.body)
             Application.findByIdAndUpdate(req.params.id, newApplication, callback);
        }
    ], function(err, application){
         if (err) return next(err);
        res.json(application);
    });
});

/* Deletes the application by id */
// Todo: delete all buils and deployments for the application
router.delete('/id/:id', function(req, res, next) {
    async.waterfall([
        function (callback) {
            Application.findByIdAndRemove(req.params.id, callback) ;
        }
    ], function (err, application){
        if (err) return next(err);
        res.json(application);
    });
});

module.exports = router;
