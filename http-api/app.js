var koa = require('koa');
var app = module.exports = koa();

var routes = require('koa-route');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');

var db = monk('localhost/apiUsers');
var users = module.exports.users = wrap(db.get('users'));

app.use(routes.post('/user', addUser));
app.use(routes.get('/user/:id', getUser));
app.use(routes.put('/user/:id', updateUser));
app.use(routes.del('/user/:id', deleteUser));

app.listen(3000);
console.log('Application listen connections at http://localhost:3000');


function* addUser() {
  var userFromRequest = yield parse(this);

  if(!userFromRequest.name) {
    this.throw(400, 'name required');
  }

  var insertedUser = yield users.insert(userFromRequest);

  this.set('location', '/user/' + insertedUser._id);
  this.status = 200;
};

function* getUser(id) {
  var user = yield users.findById(id);

  this.body = user;
  this.status = 200;
};

function* updateUser(id) {
  var userFromRequest = yield parse(this);
  yield users.updateById(id, userFromRequest);

  this.set('location', '/user/' + id);
  this.status = 204;
};

function* deleteUser(id) {
  yield users.remove({_id: id});
  this.status = 200;
}
