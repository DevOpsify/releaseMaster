'use strict';

angular.module('release-master').directive('application', function() {
  return {
    templateUrl: '/views/applications.html',
    controller: 'ApplicationController'
  };
});