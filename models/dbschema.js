var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(mongoURI);
autoIncrement.initialize(connection);

var ApplicationSchema = new Schema({
  name: {type: String, lowercase: true, trim: true},
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
  name: {type: String, lowercase: true, trim: true},
  updated_at: { type: Date, default: Date.now },
  description: String,
});
EnvironmentSchema.plugin(autoIncrement.plugin, 'Environment');

var Property = new Schema ({
  key: String,
  value: String,
});

var ProfileSchema = new Schema({
  application : { type: Number, ref: 'Application' },
  name: {type: String, lowercase: true, trim: true},
  description: String,
  properties: [Property],
  updated_at: { type: Date, default: Date.now },
});
ProfileSchema.plugin(autoIncrement.plugin, 'Profile');

var DeploymentSchema = new Schema({
  build : { type: Number, ref: 'Build' },
  application: {type: Number, ref: "Application"},
  environment : { type: Number, ref: 'Environment' },
  created_at: { type: Date, default: Date.now },  
  last_update: { type: Date, default: Date.now },  
  status: { type: String, default: "N/A" },
  properties: [Property],
});
DeploymentSchema.plugin(autoIncrement.plugin, 'Deployment');

var applicationInstance = connection.model('Application', ApplicationSchema);
var buildInstance = connection.model('Build', BuildSchema);
var deploymentInstance = connection.model('Deployment', DeploymentSchema);
var environmentInstance = connection.model('Environment', EnvironmentSchema);
var profileInstance = connection.model('Profile', ProfileSchema);

module.exports.Application = applicationInstance;
module.exports.Build = buildInstance;
module.exports.Deployment = deploymentInstance;
module.exports.Environment = environmentInstance;
module.exports.Profile = profileInstance;

ApplicationSchema.pre('remove', function(next) {
    buildInstance.remove({application: this._id}).exec();
    environmentInstance.remove({application: this._id}).exec();
    deploymentInstance.remove({application: this._id}).exec();
    next();
});

EnvironmentSchema.pre('remove', function(next) {
    deploymentInstance.remove({deployment: this._id}).exec();
    next();
});

var LatestDeploymentSchema = new Schema({
  // _id == environment._id
  value : {
    last_update: Date ,
    status:  String ,
    build :  Number
  }
});

LatestDeploymentSchema.plugin(autoIncrement.plugin, 'LatestDeployment');
var MapReduceLatestDeployment={};
MapReduceLatestDeployment.map = function() {
  var key = this.environment;
  var value = {
    last_update: this.last_update,
    status: this.status,
    build: this.build
  };
  emit(key, value);
};
MapReduceLatestDeployment.reduce = function(keyEnv, deployments) {
  reducedVal = deployments[0];
  for (var idx = 0; idx < deployments.length; idx++) {
    if ( reducedVal.last_update < deployments[idx].last_update ) {
      reducedVal.last_update = deployments[idx].last_update;
      reducedVal.status = deployments[idx].status;
      reducedVal.build = deployments[idx].build;
    }
  }
  return reducedVal;
};
MapReduceLatestDeployment.out = {replace: "latestdeployments" };

module.exports.MapReduceLatestDeployment = MapReduceLatestDeployment;
module.exports.LatestDeployment = connection.model('LatestDeployment',LatestDeploymentSchema);
