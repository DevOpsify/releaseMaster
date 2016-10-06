angular.module('release-master').factory('Environments', function($resource) {
    return $resource('/environments/:id', null, {
        'update': { method:'PUT' },
        'remove': { method:'DELETE', url:'/environments/id/:id'}
    });
});