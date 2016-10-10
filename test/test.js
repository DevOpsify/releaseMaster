var request = require("supertest");
var app = require("../app");

describe('Requests to root path', function () {
    it('responds with 200', function (done) {
        request(app)
            .get('/')
            .expect(200, done());
    });

    it('Returns html', function (done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/, done);
    });
});




