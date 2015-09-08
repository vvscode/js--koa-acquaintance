var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();
var render = require('./lib/render.js');

app.use(route.get('/', showHome));

function* showHome(id) {
  this.body = yield render('home');
};

app.listen(3000);
console.log("The app is listening on port 3000");
