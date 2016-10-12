'use strict';

angular.module('release-master').controller('ProfileController', function($scope, $routeParams, $http, Profiles) {
  var encoded = encodeURIComponent($routeParams.application);

  $http.
    get('/profiles/?application=' + encoded).
    success(function(profiles) {
      $scope.profiles = profiles;
      $scope.application=$routeParams.application;
    });

  setTimeout(function() {
    $scope.$emit('ProfileController');
  }, 0);
});