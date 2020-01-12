var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	username: { type: String, unique : true },
	password: String,
	name: String,
	status: {type: String, default: "disconnect"},
	role: {type: String, default: "User"},
	verify: {type: String, default: "not allow"},
	email: {type: String},
	friends: [{ type: Schema.ObjectId }],
	contactTime: {type: String, default: "0:0"}
});


UserSchema.plugin(passportLocalMongoose);
module.exports =  mongoose.model('User',UserSchema);