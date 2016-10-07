'use strict';

angular.module('release-master').controller('DeployController', function($scope, $routeParams, $http, $location, $timeout, Deployments) {
  console.log("test");
  var application=encodeURIComponent($routeParams.application);
  $scope.application=application;
  var build=parseInt(encodeURIComponent($routeParams.build));
  $scope.buildID=build;
  $scope.progress= {active:false,value:30};

  $scope.addDeploy = function(){

        if($scope.targetEnv.id.length < 1) return;
        $scope.progress.active=true;
        var deploy = new Deployments({ build: build, application: $scope.build.application._id, environment: $scope.targetEnv.id ,status:"N/A"});
        Deployments.save (deploy, function(deploy){
        $scope.progress.value=60;
        $timeout(function(){
          $scope.progress.value=90;
          $location.path('deployment/'+application).replace();
          },3000);
        });

    };

  $http.
    get('/environments/?application=' + application).
    success(function(environments) {
      $scope.environments = environments;
      $scope.targetEnv= {id:""};
    });
  $http.
    get('/builds/id/' + build).
    success(function(build) {
      $scope.build = build;
    });

  setTimeout(function() {
    $scope.$emit('DeployController');
  }, 0);
});