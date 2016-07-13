exports.applicationController = function($scope, $routeParams, $http) {
  $http.
    get('/applications').success(function(data) {
      $scope.application = data;
    });

  setTimeout(function() {
    $scope.$emit('applicationController');
  }, 0);
};

exports.deploymentController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.env);

  $http.
    get('/deployments/?application=' + encoded).
    success(function(data) {
      $scope.deployment = data;
    });

  setTimeout(function() {
    $scope.$emit('deploymentController');
  }, 0);
};