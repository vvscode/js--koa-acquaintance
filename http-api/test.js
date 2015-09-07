var app = require('./app.js');
var request = require('supertest').agent(app.listen());

describe("Simple User HTTP CRUD API", function() {
  var a_user = {name: 'Vasil', age: 32};

  it("adds new users", function(done) {
    request
      .post('/user')
      .send(a_user)
      .expect('location', /^\/user\/\w{24}$/)
      .expect(200, done);
  });
});
