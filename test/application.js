/**
 * Created by tom on 2016-10-11.
 */

var request = require("supertest");
var assert = require('assert');
var app = require("../app");
var HTTPStatus = require('http-status');
var dbschema = require('../models/dbschema.js');

var Application = dbschema.Application;

describe('Requests to Applications', function () {

    before(function () {
        Application.remove({}, function (error) {
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

    it('should return application json with 200 OK', function (done) {
        request(app)
            .get('/applications/name/applicationtest')
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.OK)
            .end(function (error, response) {
                if (error) throw error;
                // from previous post /applications test
                assert.equal(response.body.name, "applicationtest");
                done();
            });
    });
    
    it('should redirect to /applicationtest with 301 Moved Permanently', function (done) {
        request(app)
            .get('/applications/name/ApplicationTest')
            .expect(HTTPStatus.MOVED_PERMANENTLY)
            .expect('Location', '/applications/name/applicationtest')
            .end(done)
    });
});

