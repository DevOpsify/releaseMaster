'use strict';

angular.module('release-master').factory('Applications', function($resource) {
    return $resource('/applications/:id', null, {
        'update': { method:'PUT' },
        'remove': { method: 'DELETE', url: '/applications/name/:name'}
    });
});