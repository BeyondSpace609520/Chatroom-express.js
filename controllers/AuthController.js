var passport = require('passport');
var User = require('../models/user');
var userController = {};

var http = require('http');
var app = require('../app');
var server = http.createServer(app);
var io = require("socket.io")(server);

userController.isAdmin = function(req, res, next){
  if (req.user && req.user.verify === 'allow' && req.user.role === 'Administrator') {
    next();
  } else {
    res.redirect('/login');
  }
}

userController.isAuthorized = function(req, res, next){
  if (req.user && req.user.verify === 'allow') { //req.isAuthenticated()
    next();
  } else {
    res.redirect('/login');
  }
}

userController.home = function(req, res) {
  /*console.log(req.body);*/
  if (req.user) {
    res.render('index', {user : req.user});
  } else {
    res.redirect('/login');
  }
};

userController.register = function(req, res){
  res.render('register');
};

userController.doRegister = function(req, res){
  User.register(new User({
    username: req.body.username,
    name: req.body.name,
    role: req.body.role,
    email: req.body.email
  }), req.body.password, function(err, user){
    if(err){
      return res.render('register', {user: user});
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/');
    });
  });
};

userController.login = function(req, res){
  res.render('login');
};

userController.doLogin = function(req, res){
  passport.authenticate('local')(req, res, function(){
    res.redirect('/');
  });
};

userController.logout = function(req, res){
  if(req.user)
    User.findById(req.user._id, function (err, dbuser) {
            dbuser.status = 'disconnect';
            dbuser.save();
            dbuser.contactTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
          } );
  req.logout();
  res.redirect('/');
}

module.exports = userController;