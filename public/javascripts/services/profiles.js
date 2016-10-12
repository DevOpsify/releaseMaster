'use strict';

angular.module('release-master').factory('Profiles', function($resource) {
    return $resource('/profiles/:id', null, {
        'update': { method:'PUT' },
        'remove': { method: 'DELETE', url: '/profiles/name/:name'}
    });
});