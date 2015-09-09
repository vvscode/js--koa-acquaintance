var app = require('./../app.js');
var request = require('supertest').agent(app.listen());

var db = require("./../lib/db.js");
var co = require("co");
var should = require("should");
var testHelpers = require("./testHelpers.js");

describe("Updating questions", function () {
	beforeEach(function (done) {
		testHelpers.removeAllDocs();
		done();
	});

	afterEach(function (done) {
		testHelpers.removeAllDocs();
		done();
	});

	it("shows a nice page for existing questions", function (done) {
		co.wrap(function *() {
			var q = yield db.questions.insert({
				title: "A question?",
				tags: ["tag1", "tag2"]});

			request
				.get("/question/" + q._id)
				.expect("Content-Type", /html/)
				.expect(function (res) {
					res.text.should.containEql(q.title);
					res.text.should.containEql("tag1, tag2");
				})
				.expect(200, done);
		})();
	});

	it("updates an existing question", function (done) {
		co.wrap(function *() {
			var q = yield db.questions.insert({
				title: "A question?",
				tags: ["tag1", "tag2"]});

			request
				.post("/question/" + q._id)
				.send({
					questionTitle : "An updated question",
					tagString : "tag3, tag4"})
				.expect("location", "/question/" + q._id)
				.expect(302, done);
		})();
	});
})
