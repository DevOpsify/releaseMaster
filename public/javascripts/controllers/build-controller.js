angular.module('release-master').controller('BuildController', function($scope, $routeParams, $http) {
  var application = encodeURIComponent($routeParams.application);
  var page = parseInt('0'+encodeURIComponent($routeParams.page));
  if (page <=0)
    page=1;
  $scope.highlight = parseInt(encodeURIComponent($routeParams.build));

  $http.
    get('/builds/count/?application=' + application ).
    success(function(count) {
      $scope.pagecount=count;
      $scope.currentpage=page;
      $http.get('/builds/?application=' + application + '&page=' + page).
      success(function(data) {
        $scope.builds = data;
        $scope.application=$routeParams.application;
        $scope.propertyName = 'created_at';
        $scope.reverse = true;

      });
  });
  setTimeout(function() {
    $scope.$emit('BuildController');
  }, 0);
});