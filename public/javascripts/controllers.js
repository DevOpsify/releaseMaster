exports.applicationController = function($scope, $routeParams, $http) {
  $http.
    get('/applications').success(function(data) {
      $scope.application = data;
    });

  setTimeout(function() {
    $scope.$emit('applicationController');
  }, 0);
};