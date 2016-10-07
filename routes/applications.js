'use strict';

var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');

var async = require('async')

var Application = dbschema.Application;
var Build = dbschema.Build;

/* Gets all applications. */
/* Creates a new application */
router.route('/')
    .get(function (req, res, next) {
        async.waterfall([
            function (callbacke) {
                Application.find(callbacke);
            }
        ], function (err, applications) {
            if (err) next(err);
            res.json(applications);
        });
    })
    .post(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Application.findOne({ 'name': req.body.name }, 'name', callback);
            }
        ], function (err, application) {
            if (err) return next(err);
            if (application) {
                res.status(HTTPStatus.NOT_MODIFIED).end();
                return;
            }
            var newApplication = new Application(req.body);
            newApplication.save(function (err) { if (err) return next(err); });
            res.json(newApplication);
        });
    });

/* Gets application by name*/
router.route('/name/:name')
    .get(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Application.findOne({ 'name': req.params.name }, callback);
            }
        ], function (err, application) {
            if (err) return next(err);
            if (application) {
                res.json(application);
            } else {
                res.status(HTTPStatus.NOT_FOUND).json({ "reason": "Applicaion name not found" });
            }
        });
    });

/* Gets the application by id*/
/* Updates the application by id */
// Todo: check duplicate before update the application name?
/* Deletes the application by id */
// Todo: delete all buils and deployments for the application
router.route('/id/:id')
    .get(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Application.findById(req.params.id, callback);
            }
        ], function (err, application) {
            if (err) return next(err);
            if (application) { res.json(application); }
            res.status(HTTPStatus.NOT_FOUND).end();
        });
    })
    .put(function (req, res, next) {
        async.waterfall([
            function (callback) {
                var newApplication = new Application(req.body)
                Application.findByIdAndUpdate(req.params.id, newApplication, callback);
            }
        ], function (err, application) {
            if (err) return next(err);
            res.json(application);
        });
    })
    .delete(function (req, res, next) {
        async.waterfall([
            function (callback) {
                //Application.findByIdAndRemove(req.params.id, callback);
                console.log("current request id is" + req.params.id);
                Application.findById(req.params.id, callback);
            }
        ], function (err, application) {
            if (err) return next(err);
            console.log("current application in route delete is" + application)
            application.remove();
            res.json(application);
        });
    });

module.exports = router;
