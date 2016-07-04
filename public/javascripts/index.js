var app = angular.module('release-master', ['ng']);

app.directive('application', function() {
  return {
    controller: 'applicationController',
    template: '<div class="application" ng-repeat="app in application">' +
              '  <li>application name : {{app.name}} and with description : {{app.description}} </li>' +
              '</div>' +
              '<div ng-show="!application">' +
              ' Can not found any application'+
              '</div>'
  }
});

app.controller('applicationController', function($scope, $http) {
  $http.get('/applications').success(function(data) {
    $scope.application = data;
  });
});
