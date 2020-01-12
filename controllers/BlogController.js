var mongoose = require('mongoose');
var User = require('../models/user');
var Blog = require('../models/blog');
var Comment = require('../models/comment');
var async = require('async');
var fs = require('fs');
var blogController = {};

blogController.enterBlog = function(req, res) {
	Blog.find()
		.exec(function(err, blog_list){
			res.render('blogList', {user: req.user, blog_list: blog_list});
        });
};

blogController.getNewArticle = function(req, res) {
	res.render('postBlog', {user: req.user});
};

blogController.postNewArticle = function(req, res) {
	if(req.body.title){	
		article = new Blog;
		article.title = req.body.title;
		article.cateogry = req.body.cateogry;
		article.author = req.user.username;
		article.content = req.body.content;
		article.postTime = new Date().toLocaleString();
		article.filePath = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + req.body.filePath;
		article.fileName = req.body.filePath;
		article.save();
		res.redirect('/blog');
	}
};

blogController.detailedBlog = function(req, res) {
	async.parallel({
        article: function(callback) {
            Blog.findById(req.params.id)
              .populate('comments')
              .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
    		res.render('blogDetail', 
    			{user: req.user, article: results.article});    
    });
};
blogController.postComment = function(req, res) {
	comment = new Comment;
	comment.postTime = new Date().toLocaleString();
	comment.author = req.user.username;
	comment.content = req.body.content;

	comment.save();

	Blog.findById(req.params.id, function (err, article) {
		article.comments.push(comment._id);
		article.save();
	});
};

blogController.file_upload = function(req, res){
	var fileBase64Data = req.body.fileToUpload;
  	var fileName = req.body.fileName;
  	var filePath = 'public/uploads/blog/' + new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + fileName;

  	fs.writeFile(filePath, fileBase64Data, 'base64', function (error) {
    	if (error) {
      		res.sendStatus(500);
    	}
    	res.send({ filePath: filePath });
  	});
}

module.exports = blogController;