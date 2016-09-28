angular.module('release-master').factory('Deployments', function($resource) {
    return $resource('/deployments/:id', null, {
        'update': { method:'PUT' }
    });
});