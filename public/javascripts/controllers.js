exports.applicationController = function($scope, $routeParams, $http, Applications) {
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
    $scope.$emit('applicationController');
  }, 0);
};

exports.deploymentController = function($scope, $routeParams, $http, Environments) {
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
    };

  $http.
    get('/environments/?application=' + encoded).
    success(function(environments) {
      $scope.environments = environments;
      $scope.application=$routeParams.application;
    });

  setTimeout(function() {
    $scope.$emit('deploymentController');
  }, 0);
};

exports.buildController = function($scope, $routeParams, $http) {
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
    $scope.$emit('buildController');
  }, 0);
};



exports.deployController = function($scope, $routeParams, $http, $location, $timeout, Deployments) {
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
    $scope.$emit('deployController');
  }, 0);
};
