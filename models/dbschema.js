var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(mongoURI);
autoIncrement.initialize(connection);

var ApplicationSchema = new Schema({
  name: String,
  description: String,
  updated_at: { type: Date, default: Date.now },
});
ApplicationSchema.plugin(autoIncrement.plugin, 'Application');

var BuildSchema = new Schema ({
  application : { type: Number, ref: 'Application' },
  buildID: String,
  artifactUri : String,
  gitRepo: String,
  gitBranch: String,
  gitSHA: String,
  dockerDigest: String,
  created_at: { type: Date, default: Date.now },
});
BuildSchema.plugin(autoIncrement.plugin, 'Build');

var EnvironmentSchema = new Schema({
  application : { type: Number, ref: 'Application' },
  name: String,
  updated_at: { type: Date, default: Date.now },
  description: String,
});
EnvironmentSchema.plugin(autoIncrement.plugin, 'Environment');

var DeploymentSchema = new Schema({
  build : { type: Number, ref: 'Build' },
  application: {type: Number, ref: "Application"},
  environment : { type: Number, ref: 'Environment' },
  created_at: { type: Date, default: Date.now },  
  last_update: { type: Date, default: Date.now },  
  qaResult: { type: String, default: "N/A" }
});
DeploymentSchema.plugin(autoIncrement.plugin, 'Deployment');

module.exports.Application = connection.model('Application', ApplicationSchema);
module.exports.Build = connection.model('Build', BuildSchema);
module.exports.Deployment = connection.model('Deployment', DeploymentSchema);
module.exports.Environment = connection.model('Environment', EnvironmentSchema);