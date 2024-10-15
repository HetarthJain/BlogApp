const mongoose = require('mongoose')
const commentSchema = require('./comment.js')
const Schema = mongoose.Schema
const PostSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	username: {
		type: String,
		required: true
	},
	picture: {
		type: String,
		required: false
	},
	categories: {
		type: String,
		required: false
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'comments'
		}
	]
})
module.exports = mongoose.model('Post', PostSchema)