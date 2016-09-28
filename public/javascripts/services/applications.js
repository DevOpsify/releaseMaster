angular.module('release-master').factory('Applications', function($resource) {
    return $resource('/applications/:id', null, {
        'update': { method:'PUT' }
    });
});