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
  status: { type: String, default: "N/A" }
});
DeploymentSchema.plugin(autoIncrement.plugin, 'Deployment');

module.exports.Application = connection.model('Application', ApplicationSchema);
module.exports.Build = connection.model('Build', BuildSchema);
module.exports.Deployment = connection.model('Deployment', DeploymentSchema);
module.exports.Environment = connection.model('Environment', EnvironmentSchema);



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
