var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;
var Build = dbschema.Build;

/* GET latest build for application. */
/* Usage
// GET /api/{applicationName}/latest?q=docker&branch={branch}
*/
router.get('/:application/latest', function(req, res, next) {
  Application.findOne( {'name': req.params.application }, function(err,application){
    if (err) return next(err);
    if (application==null) {
        console.log("application not found");
        res.end();
        return;
    };
    queryString={application: application._id }
    if (req.query.branch !="") {
      queryString.gitBranch= req.query.branch;
    }
    Build.find (queryString)
    .sort({"created_at": -1})
    .limit(1)
    .exec(function (err, build) {
      if (err) return next(err);
      if (build.length==0) {
        res.end();
        return;
      };
      console.log(build.length);
      switch (req.query.q) {
        case "docker":
          res.send(build[0].dockerDigest);
          break;
        case "git":
          res.send(build[0].gitSHA);
          break;
        case "branch": 
          res.send(build[0].gitBranch);
          break;
        case "timestamp": 
          res.send(build[0].created_at);
          break;
        default: res.json(build[0]);
      }
    });
  });
});

module.exports = router;
