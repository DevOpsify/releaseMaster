var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;
var Build = dbschema.Build;

/* Gets all applications. */
router.get('/', function(req, res, next) {
    Application.find(function (err, applications) {
        if (err) return next(err);
        res.json(applications);
    });
});

/* Creates a new application */
router.post('/', function(req, res, next) {
    Application.findOne({ 'name': req.body.name }, 'name ', function (err, application) {
        if (err){
            return handleError(err);
        }
        if (application){
            console.log("duplicate");
            var res_json = {
                "reason": "Appliction name already exists"
            }
            res.status(400).json(res_json);
        }
        else {
            var newApplication = new Application(req.body);
            newApplication.save(function(err){
                console.log(err)
                if (err) return next(err);
            });
            res.json(newApplication);
        }
    });

});


/* Gets application by name*/

// Get all builds for this application
// Todo: limit the return size ?
router.get('/name/:name', function(req, res, next) {
    Application.findOne( {'name': req.params.name }, function(err,application){
        if (err) return next(err);
        if (application==null) {
            res.status(404).end();
            return;
        }

        Build.find ({application: application._id})
        .sort("created_at")
        .exec(function (err, post) {
            if (err) return next(err);
            fulljson = { application : application.name,
                description : application.description,
                applicationid : application._id,
                builds : post };
            res.json(fulljson);
        });
    });
});

/* Gets the application by id*/
router.get('/id/:id', function(req, res, next){
     Application.findById(req.params.id, function(err, application){
        if (err) return next(err);
        
        if (application==null) {
            res.status(404).end();
            return;
        }
 
        Build.find ({application: application._id})
        .sort("created_at")
        .exec(function (err, post) {
            if (err) return next(err);
            fulljson = { application : application.name,
                description : application.description,
                applicationid : application._id,
                builds : post };
            res.json(fulljson);
        });
     });
});


/* Updates the application by id */
// Todo: check duplicate before update the application name?
router.put('/id/:id', function(req, res, next) {
    Application.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* Deletes the application by name */
// Todo: delete all buils and deployments for the application
router.delete('/id/:id', function(req, res, next) {
    Build.find({application: req.params.id}).remove().exec(function(err){
        Application.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });

});

module.exports = router;
