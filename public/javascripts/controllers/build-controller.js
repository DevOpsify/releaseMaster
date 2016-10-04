angular.module('release-master').controller('BuildController', function ($scope, $routeParams, $http) {
  var application = encodeURIComponent($routeParams.application);
  $scope.highlight = parseInt(encodeURIComponent($routeParams.build));
  $scope.sortReverse  = true;
  $scope.application = $routeParams.application;
  $http.
    get('/builds/count/?application=' + application).
    success(function (count) {
      $scope.pagecount = count;
      $http.get('/builds/?application=' + application).
        success(function (data) {
          $scope.builds = data;
          $scope.propertyName = 'created_at';
          $scope.reverse = true;
        });
    });

  setTimeout(function () {
    $scope.$emit('BuildController');
  }, 0);
});