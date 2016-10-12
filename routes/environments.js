'use strict';

var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');
var moment = require('moment');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');

var async = require('async')

var Environment = dbschema.Environment;
var Application = dbschema.Application;
var Deployment = dbschema.Deployment;
var LatestDeployment = dbschema.LatestDeployment;

/* Gets all environments. */
/* Create a environment */
// Check duplicate on name
router.route('/')
  .get(function (req, res, next) {
    async.waterfall([
      function (callback) {
        if (req.query.application) {
          Application.findOne({ 'name': req.query.application }, callback);
        } else {
          var res_json = {
            "reason": "missing parameter for application"
          }
          res.status(HTTPStatus.BAD_REQUEST).json(res_json);
          return
        }
      },
      function (application, callback) {
        if (!application) {
          var res_json = {
            "reason": "can not found application with name : " + req.query.application
          }
          res.status(HTTPStatus.NOT_FOUND).json(res_json);
          return
        }
        var query = Environment.find({});
        query.where("application", application._id);
        query.sort({ "created_at": -1 })
        query.exec(function (err, environments) {
          callback(err, application, environments);
        });
      },
      function (application, environments, callback) {
        LatestDeployment.find({}).exec(function (error, latestDeployment) {
          if (error) return next(error);
          // console.log(latestDeployment);
          callback(error, application, environments, latestDeployment);
        });
      }
    ], function (error, application, environments, latestDeployment) {
      if (error) return next(error);
      var envDeployment = {};
      for (var i = 0; i < latestDeployment.length; i++) {
        envDeployment[latestDeployment[i]._id] = latestDeployment[i].value;
      }
      for (var i = 0; i < environments.length; i++) {
        var environment = environments[i].toObject();
        environment.FromNow = moment(environments[i].updated_at).fromNow();
        environment.latestDeployment = envDeployment[environment._id];
        environments[i] = environment;
      }

      res.json(environments);
    })
  })
  .post(function (req, res, next) {
    async.waterfall([
      function (callback) {
        Application.findOne({ 'name': req.body.application }, callback);
      },
      function (application, callback) {
        if (application) {
          req.body.application = application.id
          Environment.findOne({ 'name': req.body.name })
            .where("application", application._id)
            .exec(callback);
        } else {
          var res_json = {
            "reason": "Can not find application with name " + req.body.application
          }
          res.status(HTTPStatus.BAD_REQUEST).json(res_json);
          return;
        }
      }
    ], function (error, environment) {
      if (error) return next(error);
      if (environment) {
        res.status(HTTPStatus.NOT_MODIFIED).end();
        return;
      }
      var newEnvironment = new Environment(req.body);
      newEnvironment.save(function (err) {
        if (err) return next(err);
        res.status(HTTPStatus.CREATED).json(newEnvironment);
      });
    });
  });


/* Gets environment info by its id */
/* Updates the environment by id*/
// Todo: check duplicate before update the environment name?
/* Delete the environments by id */
// Todo: delete all deployments for the environment
router.route('/id/:id')
  .get(function (req, res, next) {
    async.waterfall([
      function (callback) {
        Deployment.findOne({ 'environment': req.params.id })
          .sort({ "last_update": -1 })
          .exec(callback);
      }
    ], function (error, deployment) {
      res.json(deployment);
    });
  })
  .put(function (req, res, next) {
    async.waterfall([
      function (callback) {
        var newEnvironment = new Environment(req.body);
        Environment.findByIdAndUpdate(req.params.id, newEnvironment, callback)
      }
    ], function (err, environment) {
      if (err) return next(err);
      res.json(environment);
    });
  })
  .delete(function (req, res, next) {
    async.waterfall([
      function (callback) {
        Environment.findByIdAndRemove(req.params.id, callback);
      }
    ], function (err, environment) {
      if (err) return next(err);
      res.json(environment)
    });
  });

module.exports = router;
