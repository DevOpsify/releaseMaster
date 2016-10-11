'use strict';

var express = require('express');
var router = express.Router();
var HTTPStatus = require('http-status');
var moment = require('moment');

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');

var async = require('async')

var Profile = dbschema.Profile;
var Application = dbschema.Application;

/* Gets all profiles. */
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
                var query = Profile.find({});
                query.where("application", application._id);
                query.sort({ "created_at": -1 })
                query.exec(function (err, profiles) {
                    callback(err, application, profiles);
                });
            }
        ], function (error, application, profiles) {
            if (error) return next(error);
            for (var i = 0; i < profiles.length; i++) {
                var profile = profiles[i].toObject();
                profiles.FromNow = moment(profiles[i].updated_at).fromNow();
                profiles[i] = profile;
            }

            res.json(profile);
        })
    })
    /* Create a profile */
    .post(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Application.findOne({ 'name': req.body.application }, callback);
            },
            function (application, callback) {
                if (application) {
                    req.body.application = application.id
                    Profile.findOne({ 'name': req.body.name })
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
        ], function (error, profile) {
            if (error) return next(error);
            if (profile) {
                res.status(HTTPStatus.NOT_MODIFIED).end();
                return;
            }
            var newProfile = new Profile(req.body);
            newProfile.save(function (err) {
                if (err) return next(err);
                res.json(newProfile);
            });
        });
    });


router.route('/name/:name')
    /* Gets profile by name*/
    .get(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Profile.findOne({ 'name': req.params.name }, callback);
            }
        ], function (err, profile) {
            if (err) return next(err);
            if (profile) {
                res.json(profile);
            } else {
                res.status(HTTPStatus.NOT_FOUND).json({ "reason": "Profile name not found" });
            }
        });
    })
    /* Update profile by name */
    .put(function (req, res, next) {
        async.waterfall([
            function (callback) {
                var newProfile = new Profile(req.body);
                Profile.findByIdAndUpdate(req.params.id, newProfile, callback)
            }
        ], function (err, profile) {
            if (err) return next(err);
            res.json(profile);
        });
    })
    /* Delete profile by name*/
    .delete(function (req, res, next) {
        async.waterfall([
            function (callback) {
                Profile.findOne({ 'name': req.params.name }, callback);
            }
        ], function (err, profile) {
            if (err) return next(err);
            profile.remove();
            res.json(profile);
        });
    });

module.exports = router;
