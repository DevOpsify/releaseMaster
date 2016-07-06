var request = require("supertest");
var app = require("../app");

describe('requests to root', function() {
  it('responds with 200', function(done) {
       request(app)
           .get('/')
           .expect(200)
           .end(function(error){
               if (error) throw error;
               done();
           });
  });
});

