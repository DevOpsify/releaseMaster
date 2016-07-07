var request = require("supertest");

describe('GET /', function() {

  request = request('http://localhost:3000');
  
  it('respond with 200', function(done) {
       request.get('/').expect(200, done);
  });
});

