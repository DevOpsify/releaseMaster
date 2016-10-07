'use strict';

angular.module('release-master').directive('deployment', function() {
  return {
    templateUrl: '/views/deployment.html',
    controller: 'DeploymentController'
  };
});