var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
	sender: { type: String, required: true },
	receiver: { type: String, required: true },
	timestamp: {type: String},
	type: {type: String, default: 'text'},
	text: {type: String},
	id: {type: String}
});

module.exports =  mongoose.model('Messages', ConversationSchema);