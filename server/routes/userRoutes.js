const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const { SignUpPage, SignUp, LoginPage, Login, Dashboard, getNewPost, getEditPost, postNewPost, updatePost, deletePost, Logout } = require('../controllers/userController.js')

const {commentPost,commentGet,commentReply,editComment,deleteComment} = require('../controllers/commentController.js')
const checkLoginState = require('../middleware/authMiddleware.js')
// const jwt_secret = process.env.JWT_SECRET


// GET -> Get SignUp Page
router.get("/register", SignUpPage)

// POST -> Register Details
router.post("/register", SignUp)

// GET -> Login Page
router.get("/login", LoginPage)

// POST -> Check Login details
router.post("/login", Login)

// GET -> Check in for Admin
// Middleware to verify the token
router.get("/user/dashboard",checkLoginState, Dashboard)

// GET -> User's Add new Posts Page
router.get('/add-post',checkLoginState, getNewPost)

// POST -> User Creates new post
router.post('/add-post',checkLoginState, postNewPost)

// GET -> User Edit Posts
router.get('/edit-post/:id',checkLoginState, getEditPost)

// PUT -> Admin Edit Posts
router.put('/edit-post/:id',checkLoginState, updatePost)

// DELETE -> Admin Delete Post
router.delete('/delete-post/:id',checkLoginState,  deletePost)

router.post("/post/:id/comments",checkLoginState, commentPost)

router.get("/post/:id/comments", commentGet)

router.post("/comment/:commentId/reply",checkLoginState, commentReply)

// Route to edit a comment
router.put('/comment/:id/edit',checkLoginState, editComment);

// Route to delete a comment
router.post('/comment/:comment_id/delete',checkLoginState, deleteComment);

// GET -> Admin Logout
router.get('/logout', Logout)


module.exports = router