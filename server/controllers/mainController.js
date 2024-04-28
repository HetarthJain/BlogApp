const Post = require('../models/post.js')
const comments =  require('../models/comment.js')

const Home = async (req, res) => {
	try {
		const locals = {
			title: "Blog",
			description: "simple blog crated using vanilla js, ejs, node, mongodb",
			user:req.user||null
		}

		let perpage = 10
		// default page will be 1
		let page = req.query.page || 1
		const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]).skip(perpage * page - perpage).limit(perpage).exec()
		
		const count = await Post.countDocuments({})
		const nextPage = parseInt(page) + 1
		const hasNextPage = nextPage <= Math.ceil(count / perpage)

		res.render('Home', {
			locals,
			data,
			current: page,
			nextPage: hasNextPage ? nextPage : null,
			currentRoute: '/'
		});
	} catch (err) {
		console.log(err);
	}
}
const websiteSearch = async (req, res) => {
	try {
		const locals = {
			title: "Search",
			description: "simple search",
			user:req.user
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
}
const getPost = async (req,res)=>{
	try {
		let slug = req.params.id
		const data = await Post.findById({ _id: slug })
		// Fetch comments for the post
		const allcomments = await comments.find({ post_id: slug }); 
		const locals = {
			title: data.title,
			description: "simple blog",
			user:req.user
		}
		res.render('post', {
			locals,
			data,
			currentRoute: `/post/${slug}`,
			comments: allcomments,
			currUser:req.user
		})
	}
	catch (err) {
		console.log(err)
	}
}

module.exports = {Home,getPost,websiteSearch}
