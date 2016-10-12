var request = require("supertest");
var assert = require('assert');
var app = require("../app");
var HTTPStatus = require('http-status');
var dbschema = require('../models/dbschema.js');

describe('Requests to /builds', function () {
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