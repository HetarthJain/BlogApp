const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const { SignUpPage, SignUp, LoginPage, Login, Dashboard, getNewPost, getEditPost, postNewPost, updatePost, deletePost, Logout } = require('../controllers/userController.js')

const {commentPost,commentGet,commentReply} = require('../controllers/commentController.js')
const checkLoginState = require('../middleware/authMiddleware.js')
const jwt_secret = process.env.JWT_SECRET

// check token if already logged in?
const authMiddleware = (req, res, next) => {
	const token = req.cookies.token
	if (!token) {
		return res.status(401).json({message:'Unauthorized'})
	}
	try {
		const decoded = jwt.verify(token, jwt_secret)
		req.userId = decoded.userId
		next()
	} catch (error) {
		res.status(401).json({message:'Unauthorized'})
	}
}

// GET -> Get SignUp Page
router.get("/register", SignUpPage)

// POST -> Register Details
router.post("/register", SignUp)

// GET -> Login Page
router.get("/login", LoginPage)

// POST -> Check Login details
router.post("/user", Login)

// GET -> Check in for Admin
// Middleware to verify the token
router.get(`/user/dashboard`, authMiddleware, Dashboard)

// GET -> User's Add new Posts Page
router.get('/add-post', getNewPost)

// POST -> User Creates new post
router.post('/add-post', postNewPost)

// GET -> User Edit Posts
router.get('/edit-post/:id', getEditPost)

// PUT -> Admin Edit Posts
router.put('/edit-post/:id', updatePost)

// DELETE -> Admin Delete Post
router.delete('/delete-post/:id', authMiddleware, deletePost)

router.post("/post/:id/comments", checkLoginState, commentPost)

router.get("/post/:id/comments", commentGet)

router.post("/comment/:commentId/reply",commentReply)

// GET -> Admin Logout
router.get('/logout', Logout)


module.exports = router