const Post = require('../models/post.js')
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/user'
const jwt_secret = process.env.JWT_SECRET


const SignUpPage = async (req, res) => {
	try {
		const locals = {
			title: "User",
			description: "Sign Up"
		}
		res.render("user/signup", { locals, layout: adminLayout, errormessage:"" , currentRoute:"/register"})
	} catch (error) {
		console.log(error)
	}
}

const SignUp = async (req, res) => {
	try {
		const locals = {
			title: "User",
			description: "Sign Up",
			user: req.user
		}
		const { username, password, confirmpassword } = req.body
		const hashed = await bcrypt.hash(password, 10)
		try {
			const user = await User.create({ username, password: hashed })
			// res.status(201).json({ message: 'New User created', user })
			res.redirect('/user')
		} catch (error) {
			if (error.code === 11000) {
				res.render("user/signup", { locals, layout: adminLayout ,errormessage:"User already present",currentRoute:"/register"})
			}
			res.status(500).json({message:'Internal Server Error'})
		}
	} catch(error) {
		console.log(error)
	}
}

const LoginPage = async (req, res) => {
	try {
		const locals = {
			title: "User",
			description: "Login Page",
			user: req.user
		}
		res.render("user/login", { locals, layout: adminLayout,currentRoute:"/login"})
	} catch (error) {
		console.log(error)
	}
}

const Login = async (req, res) => {
	try {
		const locals = {
			title: "User",
			description: "login Up"
		}
		const { username, password } = req.body
		const user = await User.findOne({ username })
		if (!user) {
			res.status(401).json({ message: 'User Does not exist' })
		}
		const pwd_valid = await bcrypt.compare(password, user.password)
		if (!pwd_valid) {
			res.status(401).json({ message: 'Invalid credentials' })
		}

		// setting cookie named token
		const token = jwt.sign({ userId: user._id }, jwt_secret, { expiresIn: '1h' });
		res.cookie('token', token, { httpOnly: true });

		res.redirect('/user/dashboard');
		// res.render('user/dashboard', { locals, layout: adminLayout, userPosts:userPosts });
	} catch (error) {
		console.log(error)
	}
}

const Logout = (req, res) => {
	try {
		if (req.cookies) {
			res.clearCookie('token');
			res.redirect('/')
		} else {
			res.redirect('/login')
		}
	} catch (err) {
		console.log(err);
	}
}

const Dashboard = async (req, res) => {
	try {
		if (req.user === undefined) {
			res.redirect('/login');
			return;
		}
		const locals = {
			title: 'Dashboard',
			description: 'My Blogs',
			user: req.user
		}
		// Fetch userPosts from req object
        const userPosts = req.userPosts; 
        res.render('user/dashboard', { locals, layout: adminLayout, userPosts:userPosts,currentRoute:"/user/dashboard" }); 
	} catch (error) {
		console.log(error)
	}
}

const getNewPost = async (req, res) => {
	try {
		const locals = {
			title: 'Add New Post',
			description: 'Simple Blog site',
			user: req.user
		}
		const data = await Post.find()
		res.render('user/add-posts',
			{ locals, data,layout: adminLayout, currentRoute:"/add-post" },)
	} catch (error) {
		console.log(error)
	}
}
const postNewPost = async (req, res) => {
	try {
		const username = req.user
		const new_post = new Post({
			title: req.body.title,
			body: req.body.body,
			username: username
		})
		await Post.create(new_post)
		res.redirect('user/dashboard')
	} catch (error) {
		console.log(error)
	}
}
const getEditPost = async (req, res) => {
	try {
		const locals = {
			title: 'Edit Post',
			description: 'Simple Blog site',
			user: req.user
		}
		const data = await Post.findOne({ _id: req.params.id })
		res.render('user/edit-post', {
			data,
			locals,
			layout: adminLayout,
			currentRoute:"/edit-post"
		})
	} catch (error) {
		console.log(error)
	}
}
const updatePost = async (req, res) => {
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
}
const deletePost = async (req, res) => {
	try {
		await Post.deleteOne({ _id: req.params.id })
		res.redirect('/user/dashboard')
	} catch (error) {
		console.log(error)
	}
}


module.exports = { SignUpPage, SignUp, LoginPage, Login, Dashboard, getNewPost, getEditPost, postNewPost, updatePost, deletePost, Logout }