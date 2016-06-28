var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var async = require('async')

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Deployment = dbschema.Deployment;
var Application = dbschema.Application;

/* Gets all deployments. */
router.get('/', function(req, res, next) {
    async.waterfall([
        function(callback){
            if (req.query && req.query.application){
                  Application.findOne( {'name': req.query.application }, callback);
            }else {
                callback(null, null);
            }
        },
        function (application, callback){
            if (application){
                Deployment.find({"application":application.id}, callback);
            }else if (req.query && req.query.application){
                var res_json = {
                    "reason": "can not found application with name : " + req.query.application
                }
                res.status(HTTPStatus.NOT_FOUND).json(res_json);
                return
            } else {
                Deployment.find(callback);
            }
        }
    ],function(error, deployments){
        if (error) return next(error);
        res.json(deployments);
    })
});

/* Creats a deployment */
router.post('/', function(req, res, next) {
    //TODO Need validation agaist build and env model for id check
    var deployment = new Deployment(req.body);
    if (null == deployment ){
        var res_json = {
            "reason": "invalid payload"
        }
        res.status(HTTPStatus.BAD_REQUEST).json(res_json);
    }   
    async.waterfall([
        function (callback){
            deployment.save(callback);
        }
    ], function (error, deployment){
        if (error) return next(error);
        res.json(deployment);
    });
});

/* Gets a deployment by its id */
router.get('/id/:id', function(req, res, next) {
     async.waterfall([
         function (callback) {
            Deployment.findById(req.params.id).populate("build").populate("environment").exec(callback);
         }
     ], function (error, deployment){
        if (error) return next(error);
        if(null == deployment){
            var res_json = {
                "reason": "can not found deployment with id: " + req.params.id
            }
            res.status(HTTPStatus.NOT_FOUND).json(res_json);
        }else{
            res.json(deployment);
        }
     });
});


/* Updates a deployment by its id */
/* @SW need use case here */

/* Deletes a deployment by its id */
router.delete('/id/:id', function(req, res, next) {
    async.waterfall([
        function(callback){
            Deployment.findByIdAndRemove(req.params.id, null, callback) 
        }
    ],function (error,deployment){
        if (error) return next(err);
        res.json(deployment);
    })
});

module.exports = router;
