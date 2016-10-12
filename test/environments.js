var request = require("supertest");
var assert = require('assert');
var app = require("../app");
var HTTPStatus = require('http-status');
var dbschema = require('../models/dbschema.js');

describe('Request to /environments', function () {
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