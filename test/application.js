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

    // Clean up after test is done. Note that we will run seed at the begin which will drop the database and load it with testing data
    after(function () {
        // Application.remove({}, function (error) {
        //     if (error) throw error;
        // });
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

describe('Requests to builds', function () {
    it('should return 201 with json', function (done) {

        var testBuild = {
            "application": "applicationtest",
            "gitRepo": "git@github.com/test",
            "gitSHA": "1111abcd1234",
            "gitBranch": "master",
            "dockerDigest": "sha256:12345678"
        };

        request(app)
            .post('/builds')
            .send(testBuild)
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.CREATED)
            .end(function (error, response) {
                if (error) throw error;
                assert.equal(response.body.gitRepo, "git@github.com/test")
                done();
            });
    });
});

describe('Request to environments', function () {
    it('should return 201 with json', function (done) {
        var testEnvironment = {
            "application": "applicationtest",
            "name": "ApplicationTestEnv",
            "description": "This is a description"
        }
        request(app)
            .post('/environments')
            .send(testEnvironment)
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.CREATED)
            .end(function(error, response){
                if (error) throw error;
                assert.equal(response.body.name, "applicationtestenv");
                done();
            });
    });

    it('should return 200 with json', function (done) {
        request(app)
            .get('/environments')
            .query('application=applicationtest')
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.OK)
            .end(function(error, response){
                if (error) throw error;
                assert.equal(response.body[0].name, "applicationtestenv");
                done();
            });

    });

});

describe('Requests to deployments', function () {
    // it('Should return 201 with json', function (done) {
    //
    // });

    it('Should return 200 with json', function (done) {
        request(app)
            .get('/deployments')
            .expect('Content-Type', /application\/json/)
            .expect(HTTPStatus.OK, done)
    });


});
