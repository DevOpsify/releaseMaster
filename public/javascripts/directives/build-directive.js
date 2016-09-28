angular.module('release-master').directive('build', function() {
  return {
    controller: 'BuildController',
    templateUrl: '/views/builds.html'
  };
});