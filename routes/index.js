var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;
var Build = dbschema.Build;
var Deployment = dbschema.Deployment;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Application' });
});



/* GET /applications/id */
router.get('/api/:appName/:envName', function(req, res, next) {
    Application.findOne({ 'name': req.params.appName }, '_id name')
        .exec(function (err, application) {
        if (err) return handleError(err);
        res.set('Content-Type', 'text/plain');
        if (application) {
            var globalEnv=Environment.findOne({'name':'_global', 'application': application._id}).exec();
            globalEnv.then(function(environment){
                globalkv=environment.properties;
                return Environment.findOne({'name':req.params.envName.toLowerCase(), 'application': application._id}).exec();
            }).then(function (environment) {
                var localkv = environment.properties;
                var localkey = localkv.map(function(kv){return kv.key });
                var filtered = globalkv.filter(function(kv){
                    if (localkey.indexOf(kv.key) <0){
                        return kv;
                    }
                });
                var kv = filtered.concat(localkv);
                buf = kv.map(function(p){return( p.key+"="+p.value)});
                res.send(buf.join('\n'));
                res.end();
           }).then(null, function(err){
                buf=globalkv.map(function(p){return( p.key+"="+p.value)});
                res.send(buf.join('\n'));
                res.end();
            }).end();
        };
    });
});


module.exports = router;
