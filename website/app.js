var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();

var homeRotes = require('./routes/homeRoutes.js');

app.use(route.get('/', homeRotes.showHome));



app.listen(3000);
console.log("The app is listening on port 3000");
