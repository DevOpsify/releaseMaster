var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Deployment = dbschema.Deployment;

/* Gets all deployments. */
router.get('/', function(req, res, next) {
  var filter= {};
  if (req && req.query && req.query.application){
    var appliction = Application.findOne( {'name': req.query.application });
    if (application){
        filter.application = application.id
    }else{
        var res_json = {
            "reason": "can not found application with name : " + req.query.application
        }
        res.status(HTTPStatus.BAD_REQUEST).json(res_json);
        return
    }
  }
 if (filter.application){
     Deployment.find({"application":filter.application}, function (err, deployment) {
        if (err) return next(err);
        res.json(deployment);
    });
 }else {
    Deployment.find(function (err, deployment) {
        if (err) return next(err);
        res.json(deployment);
    });
 }

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
    }else {
   	    deployment.save(function(err){
            if (err) return next(err);
            res.json(deployment);
        });
    }
});

/* Gets deployment by id */
router.get('/id/:id', function(req, res, next) {
    var deployment=Deployment.findById(req.params.id).populate("build").populate("environment").exec(function (err, deployment){
        if (err) return next(err);
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
  Deployment.findByIdAndRemove(req.params.id, req.body, function (err, deployment) {
    if (err) return next(err);
    res.json(deployment);
  });
});

module.exports = router;
