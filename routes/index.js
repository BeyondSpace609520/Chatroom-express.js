var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload_chat = multer({ dest: 'public/uploads/chat/', limits: { fieldSize: 5 * 1024 * 1024 } });
var upload_blog = multer({ dest: 'public/uploads/blog/', limits: { fieldSize: 15 * 1024 * 1024 } });

var auth = require("../controllers/AuthController.js");
var chat = require("../controllers/ChatController.js");
var dash = require("../controllers/DashboardController.js");
var blog = require("../controllers/BlogController.js");

router.get('/', auth.isAuthorized, auth.home);
router.get('/chatroom', auth.isAuthorized, chat.chatIndex);
router.post('/chat-file-upload', upload_chat.single('chat'), chat.file_upload);

router.get('/dashboard', auth.isAdmin, dash.enterDashboard);
router.get('/dashboard/:id/allow', auth.isAdmin, dash.allowUser);
router.get('/dashboard/:id/disallow', auth.isAdmin, dash.disallowUser);
router.get('/dashboard/:id/delete', auth.isAdmin, dash.deleteUser);

router.get('/blog', auth.isAuthorized, blog.enterBlog);
router.get('/blog/create', auth.isAuthorized, blog.getNewArticle);
router.post('/blog/create', auth.isAuthorized, blog.postNewArticle);
router.post('/blog-file-upload', upload_blog.single('blog'), blog.file_upload);
router.get('/blog/:id/detail', auth.isAuthorized, blog.detailedBlog);
router.post('/blog/:id/detail', auth.isAuthorized, blog.postComment);

router.get('/login', auth.login);
router.post('/login', auth.doLogin);

router.get('/register', auth.register);
router.post('/register', auth.doRegister);

router.get('/logout', auth.logout);

module.exports = router;