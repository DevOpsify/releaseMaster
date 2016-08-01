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

exports.buildController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.application);

  $http.
    get('/builds/?application=' + encoded).
    success(function(data) {
      $scope.builds = data;
      $scope.application=$routeParams.application;
      $scope.propertyName = 'created_at';
      $scope.reverse = true;

      $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
      };
    });
  setTimeout(function() {
    $scope.$emit('buildController');
  }, 0);
};
