var request = require("supertest");
var app = require("../app");
var HTTPStatus = require('http-status');
var dbschema = require('../models/dbschema.js');
var Application = dbschema.Application;

describe('Requests to root path', function () {
    it('should response with 200 and html content-type', function (done) {
        request(app)
            .get('/')
            .expect(HTTPStatus.OK)
            .expect('Content-Type', /html/, done);
    });
});

describe('Requests to Applications', function () {

    before(function () {
        Application.remove({}, function(error){
            if (error) throw error;
        });
    });

    it('should get 200 and json', function (done) {
        request(app)
            .get('/applications')
            .expect(HTTPStatus.OK)
            .expect('Content-Type', /application\/json/, done);
    });

    it('should get 201 and json', function (done) {
        request(app)
            .post('/applications')
            .send({name: "ApplicationTest", description: "This is an application description"})
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.CREATED, done);
    });


});

