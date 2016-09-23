exports.Applications = function($resource) {

    return $resource('/applications/:id', null, {
        'update': { method:'PUT' }
    });
};

exports.Environments = function($resource) {

    return $resource('/environments/:id', null, {
        'update': { method:'PUT' }
    });
};

exports.Deployments = function($resource) {

    return $resource('/deployments/:id', null, {
        'update': { method:'PUT' }
    });
};
