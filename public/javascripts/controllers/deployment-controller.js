angular.module('release-master').controller('DeploymentController', function($scope, $routeParams, $http, Environments) {
  var encoded = encodeURIComponent($routeParams.application);

  $scope.addEnvironment = function(){
        if(!$scope.envName || $scope.envName.length < 1) return;
        var environment = new Environments({ application: encoded, name: $scope.envName, description: $scope.envDesc });
        Environments.save (environment, function(environment){
          size= $scope.environments.push(environment);
          $scope.message= "environment added";
          $scope.envName = ''; // clear textbox
          $scope.envDesc = ''; // clear textbox

        }, function(error){
          $scope.message= "environment already exist!";
          $scope.envName = ''; // clear textbox
          $scope.envDesc = ''; // clear textbox
        });
        $scope.showme = false;
    };

  $http.
    get('/environments/?application=' + encoded).
    success(function(environments) {
      $scope.environments = environments;
      $scope.application=$routeParams.application;
    });

  setTimeout(function() {
    $scope.$emit('DeploymentController');
  }, 0);
});