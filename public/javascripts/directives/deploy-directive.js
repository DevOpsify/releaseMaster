angular.module('release-master').directive('deploy', function() {
  return {
    controller: 'DeployController',
    templateUrl: '/views/deploy.html'
  };
});