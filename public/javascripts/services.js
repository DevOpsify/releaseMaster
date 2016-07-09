exports.$application = function($http) {
  var application;

  s.loadApp = function() {
    $http.
      get('/application').
      success(function(data) {
        application = data;
      })
  };

  s.loadApp();

  // Reloads every hour
  setInterval(s.loadApp, 60 * 60 * 1000);

  return s;
};