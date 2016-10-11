'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');

var app = express();

var mongoose = require('mongoose');


if ( ! process.env.mongodb ) process.env.mongodb="mongodb";
global.mongoURI='mongodb://'+process.env.mongodb+'/releasemaster';

mongoose.connect(mongoURI, function(err) {
  if(err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

// var dbschema = require('./models/dbschema.js');
// var Deployment = dbschema.Deployment;
// var MapReduceLatestDeployment = dbschema.MapReduceLatestDeployment;

// var j = schedule.scheduleJob('0 * * * * *', function(){
//   console.log('find latest deployment for each environment!');

//   Deployment.mapReduce(
//     MapReduceLatestDeployment,
//     function (err, model, stats) {
//       console.log('map reduce took %d ms', stats.processtime)
//     })

// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//var routes = require('./routes/index');
//app.use('/', routes);
var applications = require('./routes/applications');
app.use('/applications', applications);
var builds = require('./routes/builds');
app.use('/builds', builds);
var deployments = require('./routes/deployments');
app.use('/deployments', deployments);
var environments = require('./routes/environments');
app.use('/environments', environments);
var profiles = require('./routes/profiles');
app.use('/profiles', profiles);
app.use(express.static('views'));

var api = require('./routes/api');
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
