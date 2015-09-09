var monk = require("monk");
var wrap = require("co-monk");
var db = monk("localhost/voteKoa");

var questions = wrap(db.get("questions"));
module.exports.questions = questions;

var votes = wrap(db.get("votes"));
module.exports.votes = votes;
