const express = require('express')
const router = express.Router()
const Post = require('../models/post.js')
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const adminLayout = '../views/layouts/admin'
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
// GET -> Login Page
router.get("/admin", async (req, res) => {
	try {
		const locals = {
			title: "Administrator",
			description: "Admin Login Page"
		}
		res.render("admin/index", { locals, layout: adminLayout})
	} catch (error) {
		console.log(error)
	}
})

// POST -> Check Login details
router.post("/admin", async (req, res) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username })
		if (!user) {
			res.status(401).json({ message: 'User Does not  exist' })
		}
		const pwd_valid = await bcrypt.compare(password, user.password)
		if (!pwd_valid) {
			res.status(401).json({ message: 'Invalid credentials' })
		}
		const token = jwt.sign({ userId: user._id, }, jwt_secret)
		res.cookie('token', token, { httpOnly: true })
		res.redirect('/dashboard')
		// if (username === 'admin' && password === 'password') {
		// 	res.send('you are logged in!')
		// } else {
		// 	res.send('wrong username or password')
		// }
		// console.log(req.body)
		
	} catch (error) {
		console.log(error)
	}
})

// GET -> Check in for Admin
// Middleware to verify the token
router.get("/dashboard", authMiddleware, async (req, res) => {
	try {
		const locals = {
			title: 'Dashboard',
			description: 'Simple Blog site'
		}
		const data = await Post.find()
		res.render('admin/dashboard', { locals, data, layout: adminLayout })
	} catch (error) {
		console.log(error)
	}
})

// GET -> Admin Add new Posts
router.get('/add-post', async (req, res) => {
	try {
		const locals = {
			title: 'Add New Post',
			description: 'Simple Blog site'
		}
		const data = await Post.find()
		res.render('admin/add-posts', { locals, data , })
	} catch (error) {
		console.log(error)
	}
})

// POST -> Register Details
router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body
		const hashed = await bcrypt.hash(password, 10)
		try {
			const user = await User.create({ username, password: hashed })
			// res.status(201).json({ message: 'New User created', user })
			res.redirect('/admin')
		} catch (error) {
			if (error.code === 11000) {
				res.status(409).json({ message: 'User already in use' })
			}
			res.status(500).json({message:'Internal Server Error'})
		}
	} catch(error) {
		console.log(error)
	}
})

// POST -> Admin Create new post
router.post('/add-post', async (req, res) => {
	try {
		console.log(req.body)
		res.redirect('/dashboard')
		const new_post = new Post({
			title: req.body.title,
			body: req.body.body
		})
		await Post.create(new_post)
		res.redirect('/dashboard')
	} catch (error) {
		console.log(error)
	}
})

// GET -> Admin Edit Posts
router.get('/edit-post/:id', async (req, res) => {
	try {
		const locals = {
			title: 'Edit Post',
			description: 'Simple Blog site'
		}
		const data = await Post.findOne({ _id: req.params.id })
		res.render('admin/edit-post', {
			data,
			layout: adminLayout
		})
		
	} catch (error) {
		console.log(error)
	}
})

// PUT -> Admin Edit Posts
router.put('/edit-post/:id', async (req, res) => {
	try {
		await Post.findByIdAndUpdate(req.params.id, {
			title: req.body.title,
			body: req.body.body,
			updatedAt: Date.now()
		})
		res.redirect(`/edit-post/${req.params.id}`)
	} catch (error) {
		console.log(error)
	}
})

// DELETE -> Admin Delete Post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
	try {
		await Post.deleteOne({ _id: req.params.id })
		res.redirect('/dashboard')
	} catch (error) {
		console.log(error)
	}
})

// GET -> Admin Logout
router.get('/logout', (req, res) => {
	res.clearCookie('token')
	res.redirect('/')
})


module.exports = router