var mongoose = require('mongoose');
var User = require('../models/user');
var Message = require('../models/message');
var Blog = require('../models/blog');
var async = require('async');

var dashController = {};

dashController.enterDashboard = function(req, res) {
	async.parallel({
		users: function(callback){
			User.find()
				.exec(callback);
		},
		articles: function(callback){
			Blog.find()
				.exec(callback);
		}
	}, function(err, result){
		if (err) { return next(err); }
		res.render('dashboard', 
			{user: req.user, user_list: result.users, blog_list: result.articles});
	});
};

dashController.allowUser = function(req, res) {
	User.findById(req.params.id, function (err, dbuser) {
      dbuser.verify = 'allow';
      dbuser.save();
    });

    res.redirect('/dashboard');
}

dashController.disallowUser = function(req, res) {
	User.findById(req.params.id, function (err, dbuser) {
      dbuser.verify = 'not allow';
      dbuser.save();
    });

    res.redirect('/dashboard');
}

dashController.deleteUser = function(req, res) {
	User.findByIdAndRemove(req.params.id, function (err, dbuser) {});

    res.redirect('/dashboard');
}

module.exports = dashController;