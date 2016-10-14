'use strict';

angular.module('release-master').directive('profile', function() {
  return {
    templateUrl: '/views/profile.html',
    controller: 'ProfileController'
  };
});