var mongoose = require('mongoose');
var User = require('../models/user');
var Message = require('../models/message');
var async = require('async');
var fs = require('fs');

var chatController = {};

chatController.chatIndex = function(req, res) {
	
	async.parallel({
		messages: function(callback){
			Message.find()
				.exec(callback);
		},
		users: function(callback){
			User.find()
				.exec(callback);
		}
	}, function(err, result){
		if (err) { return next(err); }
		res.render('chatroom', 
			{user: req.user, user_list: result.users, messages: result.messages});
	});
};

chatController.file_upload = function(req, res){
	var fileBase64Data = req.body.fileToUpload;
  	var fileName = req.body.fileName;
  	var filePath = 'public/uploads/chat/' + new Date().getTime() + fileName;

  	fs.writeFile(filePath, fileBase64Data, 'base64', function (error) {
    	if (error) {
      		res.sendStatus(500);
    	}
    	res.send({ filePath: filePath });
  	});
}
module.exports = chatController;