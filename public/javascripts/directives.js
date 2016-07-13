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
