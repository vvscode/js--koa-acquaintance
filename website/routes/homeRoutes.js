var render = require("./../lib/render.js");
var db = require("./../lib/db.js");


module.exports.showHome = function *(){
	var questionLists = yield db.questions.find({});

	this.body = yield render("home", { questions : questionLists });
};