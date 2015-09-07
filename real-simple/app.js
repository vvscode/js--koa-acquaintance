var koa = require('koa');
var app = koa();

var route = require('koa-route');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/koa_users');
var users = wrap(db.get('users'));

app.use(route.post('/user', saveUser));
app.use(route.get('/user/:id', getUser));

function* saveUser() {
  var userFromRequest = yield parse(this);
  var user = yield users.insert(userFromRequest);

  this.body = user;
  this.set('Location', '/user/' + user._id);
  this.status = 201;
}

function* getUser(id){
  var user = yield yield users.findById(id);
  this.body = user;
  this.status = 200;
}


app.listen(3000);
console.log('Application started at http://localhost:3000');
