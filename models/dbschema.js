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
  gitRepo: String,
  gitBranch: String,
  gitSHA: String,
  dockerDigest: String,
  created_at: { type: Date, default: Date.now },

});
BuildSchema.plugin(autoIncrement.plugin, 'Build');

var DeploymentSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  build : { type: Number, ref: 'Build' },
  targetEnvironment: String,
  qaResult: String,

});
DeploymentSchema.plugin(autoIncrement.plugin, 'Deployment');

module.exports.Application = connection.model('Application', ApplicationSchema);
module.exports.Build = connection.model('Build', BuildSchema);
module.exports.Deployment = connection.model('Deployment', DeploymentSchema);
// module.exports.Application = mongoose.model('Application', ApplicationSchema);
// module.exports.Build = mongoose.model('Build', BuildSchema);
// module.exports.Deployment = mongoose.model('Deployment', DeploymentSchema);
