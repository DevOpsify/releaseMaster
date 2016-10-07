'use strict';

angular.module('release-master').directive('deploy', function() {
  return {
    templateUrl: '/views/deploy.html',
    controller: 'DeployController'
  };
});