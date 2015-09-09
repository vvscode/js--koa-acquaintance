var app = require('./../app.js');
var request = require('supertest').agent(app.listen());
var co = require("co");
var should = require("should");

var db = require("./../lib/db.js");
var utils = require("./../lib/utils.js");
var testHelpers = require("./testHelpers.js");

describe("Showing results", function () {
	var filterPostData = {};

	beforeEach(function (done) {
		filterPostData = {
			questionTitle : '',
			tagString : '',
			from : '',
			to : ''
		};

		done();
	});

	afterEach(function (done) {
		testHelpers.removeAllDocs();
		done();
	});

	it("has a page to filter results from", function (done) {
		co.wrap(function *() {
			yield [
				db.questions.insert({title: "Question 1?"}),
				db.questions.insert({title: "Question 2?"}),
				db.questions.insert({title: "Question 3?"})
			];

			request
				.get("/results")
				.expect(function (res) {
					res.text.should.containEql("Question 1?");
					res.text.should.containEql("Question 2?");
					res.text.should.containEql("Question 3?");
				})
				.expect(200, done);
		})();
	});

	it("returns a excel file", function (done) {
		request
			.post('/results')
			.send(filterPostData)
	  		.expect("content-type", "application/vnd.ms-excel")
		  	.expect("content-disposition", "attachment;filename=results.xls")
			.expect(200, done);
	});

	it("filters the result by question title", function (done) {
		co.wrap(function *(){
			yield [
				db.votes.insert({ value : 1, questionTitle : "Question 1"}),
				db.votes.insert({ value : 2, questionTitle : "Question 1"}),
				db.votes.insert({ value : 3, questionTitle : "Question 1"}),
				db.votes.insert({ value : 4, questionTitle : "Question 2"})
			];

			filterPostData.questionTitle = "Question 1";

			request
				.post('/results')
				.send(filterPostData)
		  		.expect(function (res) {
		  			res.text.should.containEql('<td>Question 1</td>');
		  			res.text.should.containEql('<td>1</td>');
		  			res.text.should.containEql('<td>2</td>');
		  			res.text.should.containEql('<td>3</td>');

		  			res.text.should.not.containEql('<td>Question 2</td>');
		  		})
				.expect(200, done);
		})();
	});

	it("filters the result by from and to date", function (done) {
		co.wrap(function *(){
			var t1 = utils.yyyymmdd_to_date('2014-01-01');
			var t2 = utils.yyyymmdd_to_date('2014-01-15');
			var t3 = utils.yyyymmdd_to_date('2014-01-31');
			var t4 = utils.yyyymmdd_to_date('2014-02-01');

			yield [
				db.votes.insert({ value : 1, created_at : t1, questionTitle : "Q1" }),
				db.votes.insert({ value : 2, created_at : t2, questionTitle : "Q2"}),
				db.votes.insert({ value : 3, created_at : t3, questionTitle : "Q3" }),
				db.votes.insert({ value : 4, created_at : t4, questionTitle : "Q4" })
			];

			filterPostData.from = '2014-01-15';
			filterPostData.to = '2014-01-31';

			request
				.post('/results')
				.send(filterPostData)
		  		.expect(function (res) {
		  			res.text.should.containEql('<td>2</td>');
		  			res.text.should.containEql('<td>Q2</td>');
		  			res.text.should.containEql('<td>3</td>');
		  			res.text.should.containEql('<td>Q3</td>');

		  			res.text.should.not.containEql('<td>Q1</td>');
		  			res.text.should.not.containEql('<td>Q4</td>');
		  		})
				.expect(200, done);
		})();
	});

	it("filters the result by tag", function (done) {
		co.wrap(function *(){
			yield [
				db.votes.insert({ value : 1, tags : ['tag 1', 'tag 2'], questionTitle : "Q1" }),
				db.votes.insert({ value : 2, tags : ['tag 2'], questionTitle : "Q1"}),
				db.votes.insert({ value : 3, tags : ['tag 2', 'tag 1'], questionTitle : "Q1"}),
				db.votes.insert({ value : 4, tags : ['tag 3', 'tag 4'], questionTitle : "Q2"})
			];

			filterPostData.tagString = 'tag 2';

			request
				.post('/results')
				.send(filterPostData)
		  		.expect(function (res) {
		  			res.text.should.containEql('<td>1</td>');
		  			res.text.should.containEql('<td>2</td>');
		  			res.text.should.containEql('<td>3</td>');
		  			res.text.should.not.containEql('<td>4</td>');
		  			res.text.should.not.containEql('<td>Q2</td>');
		  		})
				.expect(200, done);
		})();
	});

	it('filters the results by several tags', function (done) {
		co.wrap(function *(){
			yield [
				db.votes.insert({ value : 1, tags : ['tag 1'], questionTitle : "Q1" }),
				db.votes.insert({ value : 2, tags : ['tag 2'], questionTitle : "Q1" }),
				db.votes.insert({ value : 3, tags : ['tag 2', 'tag 1'], questionTitle : "Q1" }),
				db.votes.insert({ value : 4, tags : ['tag 3', 'tag 4'], questionTitle : "Q2" })
			];

			filterPostData.tagString = 'tag 1, tag 2';

			request
				.post('/results')
				.send(filterPostData)
		  		.expect(function (res) {
		  			res.text.should.containEql('<td>1</td>');
		  			res.text.should.containEql('<td>2</td>');
		  			res.text.should.containEql('<td>3</td>');
		  			res.text.should.not.containEql('<td>4</td>');
		  			res.text.should.not.containEql('<td>Q2</td>');
		  		})
				.expect(200, done);
		})();
	});
});
