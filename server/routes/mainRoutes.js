const express = require('express')
const router = express.Router()

const { Home, getPost, websiteSearch } = require('../controllers/mainController')
const checkLoginState = require('../middleware/authMiddleware.js')


// GET -> Render Home.ejs Page
router.get('/',checkLoginState, Home)
// GET -> Render post.ejs Page
router.get('/post/:id',checkLoginState, getPost)
// POST ->  Renders search.ejs page websiteSearch
router.post('/search', websiteSearch)

module.exports = router;