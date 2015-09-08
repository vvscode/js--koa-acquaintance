var render = require('./../lib/render.js');

module.exports.showHome = function* showHome(id) {
  this.body = yield render('home');
};
