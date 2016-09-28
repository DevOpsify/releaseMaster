angular.module('release-master').directive('application', function() {
  return {
    controller: 'ApplicationController',
    templateUrl: '/views/applications.html'
  };
});