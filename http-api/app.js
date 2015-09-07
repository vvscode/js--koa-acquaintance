var koa = require('koa');
var app = module.exports = koa();

var routes = require('koa-route');

var userRoutes = require('./userRoutes.js');
app.use(routes.post('/user', userRoutes.addUser));
app.use(routes.get('/user/:id', userRoutes.getUser));
app.use(routes.put('/user/:id', userRoutes.updateUser));
app.use(routes.del('/user/:id', userRoutes.deleteUser));

app.listen(3000);
console.log('Application listen connections at http://localhost:3000');
