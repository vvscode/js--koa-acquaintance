var app = require('./../app.js');
var request = require('supertest').agent(app.listen());

var db = require("./../lib/db.js");
var co = require("co");
var should = require("should");
var testHelpers = require("./testHelpers.js");

describe("The homepage", function () {
	beforeEach(function (done) {
		testHelpers.removeAllDocs();
		done();
	});

	afterEach(function (done) {
		testHelpers.removeAllDocs();
		done();
	});


	it("displays nicely without errors", function (done) {
		request
			.get('/')
	  		.expect(200) // OK
			.expect('Content-Type', /html/) // displays
			.end(done);
	});

	it("lists all the questions in the database", function (done) {
		co.wrap(function *() {
			yield db.questions.insert({title: "Question Q1"});
			yield db.questions.insert({title: "Question Q2"});

			request
				.get("/")
				.expect(200)
				.expect(function (res) {
					res.text.should.containEql("Question Q1");
					res.text.should.containEql("Question Q2");
				})
				.end(done);
		})();
	});
});
