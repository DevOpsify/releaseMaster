angular.module('release-master').directive('build', function() {
  return {
    templateUrl: '/views/builds.html',
    controller: 'BuildController'
  };
});