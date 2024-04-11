const express = require('express')
const router = express.Router()
const Post = require('../models/post.js')

// GET -> Home Page
router.get('', async (req, res) => {
	try {
		const locals = {
			title: "Blog",
			description:"simple blog crated using vanilla js, ejs, node, mongodb"
		}

		let perpage = 10
		// default page will be 1
		let page = req.query.page || 1
		// { $sort: { <field1>: <sort order>, <field2>: <sort order> ... } }
		const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]).skip(perpage * page - perpage).limit(perpage).exec()
		
		const count = await Post.countDocuments({})
		const nextPage = parseInt(page) + 1
		const hasNextPage = nextPage <= Math.ceil(count/perpage)
		
		res.render('index', {
			locals,
			data,
			current: page,
			nextPage: hasNextPage ? nextPage : null,
			currentRoute: '/'
		});

	} catch (err) {
		console.log(err)
	}
})

router.get('/post/:id', async (req,res)=>{
	try {
		let slug = req.params.id
		const data = await Post.findById({ _id: slug })
		const locals = {
			title: data.title,
			description: "simple blog"	
		}
		res.render('post', {
			locals,
			data,
			currentRoute: `/post/${slug}`
		})
	}
	catch (err) {
		console.log(err)
	}
})

router.post('/search', async (req, res) => {
	try {
		const locals = {
			title: "Search",
			description: "simple search"
		}
		const searchTerm = req.body.searchTerm
		const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
		const data = await Post.find({
			$or: [
				{ title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
				{ body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
			]
		});

		res.render("search", {
			data,
			locals,
			currentRoute: '/'
		})
	} catch (err) {
		console.log(err)
	}
	})

// function insertPostData() {
// 	Post.insertMany([
// 		{
// 			title: "Asynchronous Programming with Node.js",
// 			body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
// 		},
// 		{
// 			title: "NodeJs Limiting Network Traffic",
// 			body: "Learn how to limit netowrk traffic."
// 		},
// 		{
// 			title: "build real-time, event-driven applications in Node.js",
// 			body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
// 		},
// 	])
// }
// insertPostData()

router.get('/about', (req, res) => {
	res.render('about', {
		currentRoute: '/about'
		
	})
})

module.exports = router