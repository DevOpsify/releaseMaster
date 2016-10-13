'use strict';

angular.module('release-master').controller('ProfileController', function($scope, $routeParams, $http, Profiles) {
  var encoded = encodeURIComponent($routeParams.application);
  $scope.checked = 0;
  $scope.limit = 2;
  $scope.checkChanged = function(profile){
        if(profile.selected) $scope.checked++;
        else $scope.checked--;
    }

  $http.
    get('/profiles/?application=' + encoded).
    success(function(profiles) {
      $scope.profiles = profiles;
      $scope.application=$routeParams.application;
      console.log($scope.profiles);
    });

  setTimeout(function() {
    $scope.$emit('ProfileController');
  }, 0);
});