const express = require('express')
const router = express.Router()

const { Home, getPost, websiteSearch } = require('../controllers/mainController')
const checkLoginState = require('../middleware/authMiddleware.js')


// GET -> Home Page
router.get('/', Home)
// GET -> Get any post on Home Page
router.get('/post/:id', getPost)
// POST -> websiteSearch
router.post('/search', websiteSearch)

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

// router.get('/about', (req, res) => {
// 	res.render('about', {
// 		currentRoute: '/about'
		
// 	})
// })

module.exports = router