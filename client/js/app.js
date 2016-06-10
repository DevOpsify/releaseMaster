

var app = angular.module('applicationApp', ['lbServices']);
 
app.controller('applicationController', function($scope, $http,Application) {
 
    $scope.applications = Application.find();
    $scope.application;
    $scope.loading=false;

    $scope.add = function(){
        $scope.loading=true;
        
        Application.create({name: $scope.application.name,description: $scope.application.description }).$promise
             .then(function(application) { 
                    $scope.applications.push(application);
                    $scope.application.title='';
                    $scope.loading=false;
              });;
    };

    $scope.delete = function($index){
        
        $scope.loading=true;
        var application = $scope.applications[$index];
        
        Application.deleteById({ id: application.id}).$promise
            .then(function() {
                $scope.applications.splice($index,1);
                $scope.loading=false;
             });
    };

    $scope.update = function(application){
        application.$save();
    };
    
});

