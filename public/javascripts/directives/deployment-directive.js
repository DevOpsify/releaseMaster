angular.module('release-master').directive('deployment', function() {
  return {
    controller: 'DeployController',
    templateUrl: '/views/deploy.html'
  };
});