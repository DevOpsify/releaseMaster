angular.module('app', ['ngRoute', 'ngResource'])

//---------------
// Services
//---------------

.factory('Applications', ['$resource', function($resource){
    return $resource('/applications/:id', null, {
        'update': { method:'PUT' }
    });
}])
.factory('Environments', ['$resource', function($resource){
    return $resource('/environments/:id', null, {
        'update': { method:'PUT' },
    });
}])
.factory('Properties', ['$resource', function($resource){
    return $resource('/properties/:id', null, {
        'update': { method:'PUT' }
    });
}])

//---------------
// Controllers
//---------------

.controller('ApplicationCtrl', function ($scope, Applications, Environments, Properties) {


    $scope.showForm = function(form){
        $scope.forms[form]=true;
    }
    $scope.hideForm = function(form){
        $scope.forms[form]=false;
    }
    $scope.newApp = function(){
        $scope.loading['app']=true;
        $scope.hideForm('addApp');
        if(!$scope.newApplication || $scope.newApplication.length < 1) return;
        var application = new Applications({ name: $scope.newApplication });
        application.$save(function(app, head){
            if (app._id != null) {
                size= $scope.applications.push(application);
                $scope.message= "application added";
                $scope.selectedApplication=size-1;
                $scope.selectApp($scope.selectedApplication);
            }else{
                $scope.message= "application already exist!";
            }
            $scope.newApplication = ''; // clear textbox
              $scope.loading['app']=false;


        });
    }
    $scope.newEnv= function(){
        $scope.hideForm('addEnv');
        if(!$scope.newEnvironment || $scope.newEnvironment.length < 1) return;
        var environment = new Environments({ name: $scope.newEnvironment, isRoot: false, application: $scope.applications[$scope.selectedApplication]._id });
        environment.$save(function(env,head){
            console.log(env);
            if (env._id != null) {
                $scope.environments.push(environment);
                $scope.message= "environment added";
            }else{
                $scope.message= "environment already exist!";
            }
        $scope.newEnvironment = ''; // clear textbox
        });
    }
    $scope.copyGlobal = function(index){
        console.log($scope.globalproperties[index]);
        console.log($scope.properties);
        $scope.loading['localprop']=true;
        $scope.saveProperty($scope.globalproperties[index].key,$scope.globalproperties[index].value);
    }
    $scope.newProperty = function(){
        if(!$scope.newKey || $scope.newKey.length < 1) return;
        $scope.loading['localprop']=true;
        if ($scope.environments[$scope.selectedEnvironment].name=="_global") $scope.loading['globalprop']=true;
        $scope.saveProperty($scope.newKey, $scope.newValue);
    }

    $scope.saveProperty=function(key,value){
        var property = new Properties({ key: key, value: value, environment: $scope.environments[$scope.selectedEnvironment]._id });
        property.$save(function(prop,head){
            // console.log(prop);
            if (prop.environment == null){
            $scope.properties.push(property);
            if ($scope.environments[$scope.selectedEnvironment].name=="_global") $scope.globalproperties.push(property);
            }else{
                $scope.message= "property key already exist!";
            }
            $scope.newKey = ''; // clear textbox
            $scope.newValue = ''; // clear textbox
            $scope.loading['localprop']=false;
            $scope.loading['globalprop']=false;
        });        
    }

    $scope.editProperty = function(index){
        $scope.editing = index;
    }
    $scope.cancelEdit = function(index){
        $scope.editing =-1 ;
    }
    $scope.updateProperty =function(index){
        console.log(index);
        $scope.editing =-1 ;
        $scope.loading['localprop']=true;
        var newProperty = $scope.properties[index];
        Properties.update({id: $scope.environments[$scope.selectedEnvironment]._id}, newProperty,function(){
            $scope.loading['localprop']=false;
        });


    }

    $scope.delApp = function(index){
        if (confirm("sure to delete")) {
            $scope.loading['app']=true;
            $scope.message= "";
            $scope.selectedApplication=null;
            var toremove = $scope.applications[index];
            Applications.remove({id: toremove._id}, function(){
                $scope.applications.splice(index,1);
                $scope.environments=null;
                $scope.properties=null;
                $scope.selectedApplication=0;
                $scope.selectApp(0);
                $scope.loading['app']=false;
            });
        }
    }
    $scope.delEnv= function(index){
        //var index = $scope.selectedEnvironment;
        if (confirm("sure to delete")) {
            $scope.loading['env']=true;
            var toremove = $scope.environments[index];
            Environments.remove({id: toremove._id}, function(){
                $scope.environments.splice(index,1);
                $scope.properties=null;
                $scope.selectedEnvironment=0;
                $scope.selectEnv(0);
                $scope.loading['env']=false;
            });
        }
    }
    $scope.delProperty = function(index){
        if (confirm("sure to delete")) {
            $scope.loading['localprop']=true;
            if ($scope.environments[$scope.selectedEnvironment].name=="_global") $scope.loading['globalprop']=true;
            var toremove = $scope.properties[index];
            console.log(toremove);
            Properties.remove({id: $scope.environments[$scope.selectedEnvironment]._id, key: toremove.key }, function(){
                $scope.properties.splice(index,1);
                if ($scope.environments[$scope.selectedEnvironment].name=="_global") $scope.globalproperties.splice(index,1);
                $scope.loading['localprop']=false;
                $scope.loading['globalprop']=false;
            });
        }
    }
    $scope.selectApp = function(app){
        $scope.loading['env']=true;
        $scope.environments=null;
        $scope.properties=null;
        $scope.selectedApplication = app;
        Applications.get({id: $scope.applications[app]._id },function(fulljson){
            $scope.loading['env']=false;
            $scope.environments=fulljson.environments;
            $scope.selectedEnvironment=0;
            Environments.get({id:fulljson.environments[0]._id}, function(global){
                $scope.globalproperties = global.properties;
                $scope.loading['globalprop']=false;
            })
        });
    }
    $scope.selectEnv = function(env){
        $scope.loading['localprop']=true;
        $scope.properties=null;
        $scope.selectedEnvironment = env;
        Environments.get({id:$scope.environments[env]._id}, function(env){
            $scope.properties = env.properties;
            $scope.editing = -1;
            $scope.loading['localprop']=false;
        });
    }
        $scope.editing = -1;

        $scope.forms=[];
        $scope.forms['addApp']=false;
        $scope.forms['addEnv']=false;
        $scope.loading=[];
        $scope.loading['app']=true;
        $scope.loading['env']=true;
        $scope.loading['globalprop']=true;
        $scope.loading['localprop']=true;

    $scope.message= "";
    $scope.applications = Applications.query(function(){
        $scope.environments=null;
        $scope.properties=null;
        $scope.selectedApplication=0;
        console.log("ApplicationCtrl")
        $scope.loading['app']=false;
        $scope.selectApp(0);        
    });
    // $scope.$apply();



})



