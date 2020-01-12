var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	title: {type: String},
	cateogry: {type: String},
	postTime: {type: String},
	author: {type: String},
	content: {type: String},
	comments: [{type: Schema.ObjectId, ref: 'Comment'}],
	verify: {type: String, default: "not allow"},
	filePath: {type: String},
	fileName: {type: String}
});

module.exports =  mongoose.model('Blog', BlogSchema);