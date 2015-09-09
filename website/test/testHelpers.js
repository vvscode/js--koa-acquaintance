var db = require("./../lib/db.js");
var co = require("co");


module.exports.removeAllDocs = function () {
	co.wrap(function *() {
		yield db.questions.remove({});
		yield db.votes.remove({});
	})();
};
