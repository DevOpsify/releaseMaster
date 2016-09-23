exports.application = function() {
  return {
    controller: 'applicationController',
    templateUrl: '/views/applications.html'
  };
};

exports.deployment = function() {
  return {
    controller: 'deploymentController',
    templateUrl: '/views/deployment.html'
  };
};

exports.build = function() {
  return {
    controller: 'buildController',
    templateUrl: '/views/builds.html'
  };
};

exports.deploy = function() {
  return {
    controller: 'deployController',
    templateUrl: '/views/deploy.html'
  };
};
