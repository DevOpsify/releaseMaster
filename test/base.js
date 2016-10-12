var request = require("supertest");
var app = require("../app");
var HTTPStatus = require('http-status');

describe('Requests to root path', function () {
    it('should response with 200 and html content-type', function (done) {
        request(app)
            .get('/')
            .expect(HTTPStatus.OK)
            .expect('Content-Type', /html/, done);
    });
});

