var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;
var Build = dbschema.Build;

/* GET /properties listing. */
router.get('/', function(req, res, next) {
  Property.find(function (err, properties) {
    if (err) return next(err);
    res.json(properties);
  });
});

/* POST /properties */
router.post('/', function(req, res, next) {
    var kv = {"key":req.body.key, "value":req.body.value};
    var env=Environment.findById(req.body.environment)
    .exec(function(err,env){
        if (err) return next(err);
        console.log(kv.key);
        if (env.properties.map(function(kv){return kv.key }).indexOf(kv.key)<0){
            env.properties.push (kv);

        env.properties.sort(function(a,b){
          var x=a.key; var y=b.key;
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));      
        });
            env.save(function(err){
                if (err) return next(err);
                res.json(kv);
            });            
        }else{
            res.json(null);
        }
    });
});


/* GET /properties/id */
router.get('/:id', function(req, res, next) {
  // Property.findById(req.params.id, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
    var env=Environment.findById(req.params.id).exec();
    env.then(function(environment){
        res.json(environment.properties);
    });
});

/* PUT /properties/:id */
router.put('/:id', function(req, res, next) {
  var env=Environment.findById(req.params.id).exec();
  env.then(function (environment){

    for(var i in environment.properties){
      if (environment.properties[i].key == req.body.key){
        environment.properties[i].value= req.body.value;
        break;
      }
    }
    environment.properties.sort(function(a,b){
      var x=a.key; var y=b.key;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));      
    });
    environment.save(function(err){
        if (err) return next (err);
        res.json (environment);
    });

  });
});

/* DELETE /properties/:id */
router.delete('/:id', function(req, res, next) {
  // Property.findByIdAndRemove(req.params.id, req.body, function (err, post) {
  //   if (err) return next(err);
  //   res.json(post);
  // });
console.log(req.params.id);
console.log(req.query.key);
    var env=Environment.findById(req.params.id).exec();
    env.then(function (environment){
         // console.log(req);
         environment.properties=environment.properties.filter(function(property){
          return property.key != req.query.key;
         });
        // console.log(environment.properties);
        // environment.properties.splice(0,1);
        console.log(environment.properties);
        environment.save(function(err){
            if (err) return next (err);
            res.json (environment);
        });
    });
});

module.exports = router;
