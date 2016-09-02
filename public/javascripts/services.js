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