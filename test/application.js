/**
 * Created by tom on 2016-10-11.
 */

var request = require("supertest");
var app = require("../app");
var HTTPStatus = require('http-status');
var dbschema = require('../models/dbschema.js');

var Application = dbschema.Application;

describe('Requests to Applications', function () {

    before(function () {
        Application.remove({}, function(error){
            if (error) throw error;
        });
    });

    it('should get 200 and json', function (done) {
        request(app)
            .get('/applications')
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.OK, done)
    });

    it('should get 201 and json', function (done) {
        request(app)
            .post('/applications')
            .send({name: "ApplicationTest", description: "This is an application description"})
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.CREATED, done);
    });

    it('should return application json', function (done) {
        request(app)
            .get('/applications/name/ApplicationTest')
            .expect(HTTPStatus.OK)
            .expect('Content-Type', /application\/json/)
            .expect(/This is an application description/, done);
    });
});

