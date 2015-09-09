var app = require('./../app.js');
var request = require('supertest').agent(app.listen());

var db = require("./../lib/db.js");
var co = require("co");
var should = require("should");
var testHelpers = require("./testHelpers.js");

describe("Adding votes", function () {
	beforeEach(function (done) {
		testHelpers.removeAllDocs();
		done();
	});

	afterEach(function (done) {
		testHelpers.removeAllDocs();
		done();
	});

	var test_question = { title : "To be?", tags : ["tag1", "tag2"] };

	it("has a page for voting from", function (done) {
		co.wrap(function *() {
			var q = yield db.questions.insert(test_question);

			request
				.get("/vote?questionId=" + q._id)
				.expect("Content-Type", /html/)
				.expect(function (res) {
					res.text.should.containEql(q.title);
				})
				.expect(200, done);
		})();
	});

	it('returns error when no question can be found', function(done){
		request
			.get('/vote?questionId=000000000000000000000000')
			.expect(302)
			.expect('location', '/')
			.expect('ErrorMessage', "No question found for id: '000000000000000000000000'")
			.end(done);
	});

	it('returns error when no questionId is passed to the page', function (done) {
		request
			.get('/vote')
			.expect(302)
			.expect('location', '/')
			.expect('ErrorMessage', 'No questionId passed to page')
			.end(done);
	});


	var test_vote_form = {
		tagString : "tag1, tag2, tag3",
		questionId : 000000000000000000000000,
		voteValue: 4
	};

	it('add vote and redirect to comment page', function(done){
		co.wrap(function *() {
			var q = yield db.questions.insert({ title : "A question"});
			test_vote_form.questionId = q._id;

			request
				.post('/vote')
				.send(test_vote_form)
				.expect("location", /^\/vote\/[0-9a-fA-F]{24}\/comment$/)
				.expect(302, done);
		})();
	});

	it('requires a question reference', function (done) {
		delete test_vote_form.questionId;

		request
			.post('/vote')
			.send(test_vote_form)
			.expect('location', '/')
			.expect('ErrorMessage', 'QuestionId required')
			.expect(302, done);
	});
});








