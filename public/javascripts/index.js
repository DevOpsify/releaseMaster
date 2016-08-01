var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');

var _ = require('underscore');

var components = angular.module('release-master.components', ['ng']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

_.each(services, function(factory, name) {
  components.factory(name, factory);
});

var app = angular.module('release-master', ['release-master.components', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      template: '<application></application>'
    }).
    when('/builds/:application', {
      template: '<build></build>'
    }).
    when('/deployment/:env', {
      template: '<deployment></deployment>'
    });
});


