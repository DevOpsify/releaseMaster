angular.module('release-master').controller('ApplicationController', function($scope, $routeParams, $http, Applications) {
    $scope.addApplication = function(){
        if(!$scope.appName || $scope.appName.length < 1) return;
        var application = new Applications({ name: $scope.appName, description: $scope.appDescription });
        Applications.save (application, function(application){
          size= $scope.applications.push(application);
          $scope.message= "application added";
          $scope.appName = ''; // clear textbox
          $scope.appDescription = ''; // clear textbox

        }, function(error){
          $scope.message= "application already exist!";
          $scope.appName = ''; // clear textbox
          $scope.appDescription = ''; // clear textbox
        });
    };

    $scope.applications = Applications.query(function(){
        console.log("ApplicationCtrl")
    });
    
    setTimeout(function() {
        $scope.$emit('ApplicationController');
    }, 0);
});