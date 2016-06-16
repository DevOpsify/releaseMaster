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



module.exports = router;
