var app = require('./app.js');
var request = require('supertest').agent(app.listen());
var co = require('co');

describe("Simple User HTTP CRUD API", function() {
  var a_user = {};
  var removeAll = function(done) {
    co.wrap(function* () {
      yield app.users.remove({});
    })().then(done, done);
  };

  beforeEach(function(done) {
    a_user = {name: 'Vasil', age: 32};
    removeAll(done);
  });

  afterEach(function(done) {
    removeAll(done);
  });

  it("adds new users", function(done) {
    request
      .post('/user')
      .send(a_user)
      .expect('location', /^\/user\/\w{24}$/)
      .expect(200, done);
  });

  it('fails with validation error for users without name', function(done) {
    delete a_user.name;
    request
      .post('/user')
      .send(a_user)
      .expect('name required')
      .expect(400, done);
  });

  it("get existing user by id", function(done) {
    co.wrap(function* () {
      var insertedUser = yield app.users.insert(a_user);
      var url = '/user/' + insertedUser._id;
      request
        .get(url)
        .set('Accept', 'application/json')
        .expect(/Vasil/)
        .expect(/32/)
        .expect(200, done);
    })();
  });

  it("updated an existing user", function(done) {
    co.wrap(function* () {
      var insertedUser = yield app.users.insert(a_user);
      var url = '/user/' + insertedUser._id;

      request
        .put(url)
        .send({name: 'vAsil', age: 10})
        .expect('location', url)
        .expect(204)
        .end(function(err) {
          if(err) return done(err);

          request
            .get(url)
            .expect(/vAsil/)
            .expect(/10/)
            .expect(200, done);
        });
    })();
  });

  it("remove an existing user", function(done) {
    co.wrap(function* () {
      var insertedUser = yield app.users.insert(a_user);
      var url = '/user/' + insertedUser._id;

      request
        .del(url)
        .expect(200, done);
    })();
  });
});
