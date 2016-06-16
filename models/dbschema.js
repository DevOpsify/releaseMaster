var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  name: String,
  description: String,
  updated_at: { type: Date, default: Date.now },
});

var BuildSchema = new Schema ({
  application : { type: Schema.ObjectId, ref: 'Application' },
  gitRepo: String,
  gitBranch: String,
  gitSHA: String,
  dockerDigest: String,
  created_at: { type: Date, default: Date.now },

});
var DeploymentSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  build : { type: Schema.ObjectId, ref: 'Build' },
  targetEnvironment: String,
  qaResult: String,

});


module.exports.Application = mongoose.model('Application', ApplicationSchema);
module.exports.Build = mongoose.model('Build', BuildSchema);
module.exports.Deployment = mongoose.model('Deployment', DeploymentSchema);
