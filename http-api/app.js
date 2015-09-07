var koa = require('koa');
var app = module.exports = koa();

var routes = require('koa-route');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');

var db = monk('localhost/apiUsers');
var users = wrap(db.get('users'));

app.use(routes.post('/user', addUser));

app.listen(3000);
console.log('Application listen connections at http://localhost:3000');


function* addUser() {
  var userFromRequest = yield parse(this);

  var insertedUser = yield users.insert(userFromRequest);

  this.set('location', '/user/' + insertedUser._id);
  this.status = 200;
}
