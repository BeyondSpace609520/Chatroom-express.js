var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	postTime: {type: String},
	author: {type: String},
	content: {type: String}
});

module.exports =  mongoose.model('Comment', CommentSchema);