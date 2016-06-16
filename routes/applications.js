var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;
var Build = dbschema.Build;

/* GET /applications listing. */
router.get('/', function(req, res, next) {
    Application.find(function (err, applications) {
        if (err) return next(err);
        res.json(applications);
    });
});

/* POST /applications */
// Check duplicate on name
router.post('/', function(req, res, next) {
    console.log(req.body);
    Application.findOne({ 'name': req.body.name }, 'name ', function (err, application) {
        if (err) return handleError(err);
        if (application) {
            console.log("duplicate");
            res.json(application);
        }
        else
        {
            var newApplication = new Application(req.body);
            newApplication.save(function(err){
                if (err) return next(err);
            }); 
            res.json(newApplication);
        }
    });

});


/* GET /applications/name */
// Get all builds for this application
// Todo: limit the return size ?
router.get('/:name', function(req, res, next) {
    Application.findOne( {'name': req.params.name }, function(err,application){
        if (err) return next(err);
        if (application==null) {
            console.log("application not found");
            res.end();
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

router.get('/:name/:branch', function(req, res, next) {
    Application.findOne( {'name': req.params.name }, function(err,application){
        if (err) return next(err);
        if (application==null) {
            console.log("application not found");
            res.end();
            return;
        }
        console.log(req.params);

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

/* PUT /applications/:id */
// Todo: check duplicate before update the application name?
router.put('/:id', function(req, res, next) {
    Application.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /applications/:id */
// Todo: delete all buils and deployments for the application
router.delete('/:id', function(req, res, next) {
    Build.find({application: req.params.id}).remove().exec(function(err){
        Application.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });        
    });

});

module.exports = router;
