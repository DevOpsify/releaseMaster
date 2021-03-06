'use strict';

var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var async = require('async')

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Deployment = dbschema.Deployment;
var Application = dbschema.Application;
var Build = dbschema.Build;
var Environment = dbschema.Environment;
var MapReduceLatestDeployment = dbschema.MapReduceLatestDeployment;
var request = require('request');

/* Gets all deployments. */
/* Creats a deployment */
router.route('/')
    .get(function (req, res, next) {
        async.waterfall([
            function (callback) {
                if (req.query && req.query.application) {
                    Application.findOne({'name': req.query.application}, callback);
                } else {
                    callback(null, null);
                }
            },
            function (application, callback) {
                if (application) {
                    Deployment.find({"application": application.id}, callback);
                } else if (req.query && req.query.application) {
                    var res_json = {
                        "reason": "can not found application with name : " + req.query.application
                    }
                    res.status(HTTPStatus.NOT_FOUND).json(res_json);
                    return
                } else {
                    Deployment.find(callback);
                }
            }
        ], function (error, deployments) {
            if (error) return next(error);
            res.status(HTTPStatus.OK).json(deployments);
        })
    })
    .post(function (req, res, next) {
        //TODO Need validation against build and env model for id check
        request(
            {
                method: 'GET'
                , uri: 'http://admin:password@pasjenkins0.economicalinsurance.com:8080/job/test/build?token=secret'
                , gzip: true
            }, function (error, response, body) {
                console.log(error);
                console.log(response);
            });

        var deployment = new Deployment(req.body);

        if (null == deployment.build) {
            var res_json = {
                "reason": "invalid payload"
            }
            res.status(HTTPStatus.BAD_REQUEST).json(res_json);
            return;
        }
        async.waterfall([
            function (callback) {
                Build.findById(deployment.build).exec(callback)
            },
            function (build, callback) {

                Environment.findOne({'_id': deployment.environment}).exec(function (err, environment) {
                    if (err) return next(error);

                    deployment.application = build.application;
                    deployment.environment = environment.id;
                    deployment.save(callback);
                })
            }
        ], function (error, deployment) {
            if (error) return next(error);
            Deployment.mapReduce(
                MapReduceLatestDeployment,
                function (err, model, stats) {
                    console.log('map reduce took %d ms', stats.processtime)
                })

            res.status(HTTPStatus.CREATED).json(deployment);
        });
    });

router.route('/id/:id')
    /* Gets a deployment by its id */
    .get(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Deployment.findById(req.params.id).populate("build").populate("application").populate("environment").exec(callback);
            }
        ], function (error, deployment) {
            if (error) return next(error);
            if (null == deployment) {
                var res_json = {
                    "reason": "can not found deployment with id: " + req.params.id
                }
                res.status(HTTPStatus.NOT_FOUND).json(res_json);
            } else {
                res.json(deployment);
            }
        });
    })
    /* Updates a deployment status by its id */
    .put(function (req, res, next) {
        console.log(req.params.id);
        async.waterfall([
            function (callback) {
                Deployment.findById(req.params.id).exec(callback);
            },
            function (deployment, callback) {
                deployment.status = req.body.status;
                deployment.last_update = Date.now();
                deployment.save(callback);
            }
        ], function (err, deployment) {
            if (err) return next(err);
            res.json(deployment);
        });
    })
    /* Deletes a deployment by its id */
    .delete(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Deployment.findById(req.params.id, callback);
            }
        ], function (error, deployment) {
            if (error) return next(err);
            deployment.remove();
            res.json(deployment);
        })
    });

module.exports = router;
