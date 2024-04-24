const Post = require('../models/post.js')
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/user'
const jwt_secret = process.env.JWT_SECRET

const locals = {
	title: "User",
	description: "Sign Up"
}
let userPosts;


const SignUpPage = async (req, res) => {
	try {
		res.render("user/signup", { locals, layout: adminLayout, errormessage:"" })
	} catch (error) {
		console.log(error)
	}
}

const SignUp = async (req, res) => {
	try {
		const { username, password, confirmpassword } = req.body
		const hashed = await bcrypt.hash(password, 10)
		try {
			const user = await User.create({ username, password: hashed })
			// res.status(201).json({ message: 'New User created', user })
			res.redirect('/user')
		} catch (error) {
			if (error.code === 11000) {
				res.render("user/signup", { locals, layout: adminLayout ,errormessage:"User already present"})
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
			description: "Login Page"
		}
		res.render("user/login", { locals, layout: adminLayout})
	} catch (error) {
		console.log(error)
	}
}

// const Login = async (req, res) => {
// 	try {
// 		const { username, password } = req.body
// 		const user = await User.findOne({ username })
// 		if (!user) {
// 			res.status(401).json({ message: 'User Does not exist' })
// 		}
// 		const pwd_valid = await bcrypt.compare(password, user.password)
// 		if (!pwd_valid) {
// 			res.status(401).json({ message: 'Invalid credentials' })
// 		}
// 		const token = jwt.sign({ userId: user._id, }, jwt_secret)

// 		userPosts = await Post.find({ username: { $eq: username } })
		
// 		res.cookie('token', token, { httpOnly: true })
// 		res.render(`user/dashboard`,{locals, userPosts:userPosts,currentRoute:'/user/dashboard'})
// 	} catch (error) {
// 		console.log(error)
// 	}
// }

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'User Does not exist' });
        }
        const pwd_valid = await bcrypt.compare(password, user.password);
        if (!pwd_valid) {
            res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, jwt_secret);
        // Store token in session or client-side storage
        req.session.token = token; // If using session
        // or
        res.cookie('token', token, { httpOnly: true }); // If using cookies
        res.redirect('user/dashboard');
    } catch (error) {
        console.log(error);
    }
};


const Dashboard = async (req, res) => {
	try {
		const locals = {
			title: 'Dashboard',
			description: 'My Blogs'
		}
		// Fetch userPosts from req object
        const userPosts = req.userPosts || []; // Ensure userPosts is available
        res.render('user/dashboard', { locals, layout: adminLayout, userPosts:userPosts }); // Pass userPosts to the template
		// res.render('user/dashboard',authMiddleware, { locals, layout: adminLayout, userPosts:userPosts })
	} catch (error) {
		console.log(error)
	}
}

const getNewPost = async (req, res) => {
	try {
		const locals = {
			title: 'Add New Post',
			description: 'Simple Blog site'
		}
		const data = await Post.find()
		res.render('user/add-posts',
			{ locals, data, currentRoute:"/add-post" })
	} catch (error) {
		console.log(error)
	}
}
const postNewPost = async (req, res) => {
	try {
		// console.log(req.body)
		// res.redirect('/dashboard')
		const username = req.user.username
		const new_post = new Post({
			title: req.body.title,
			body: req.body.body,
			username: username
		})
		await Post.create(new_post)
		res.redirect('/user/dashboard')
	} catch (error) {
		console.log(error)
	}
}
const getEditPost = async (req, res) => {
	try {
		const locals = {
			title: 'Edit Post',
			description: 'Simple Blog site'
		}
		const data = await Post.findOne({ _id: req.params.id })
		res.render('user/edit-post', {
			data,
			layout: adminLayout
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
const Logout = (req, res) => {
	res.clearCookie('token')
	res.redirect('/')
}


module.exports = { SignUpPage, SignUp, LoginPage, Login, Dashboard, getNewPost, getEditPost, postNewPost, updatePost, deletePost, Logout }