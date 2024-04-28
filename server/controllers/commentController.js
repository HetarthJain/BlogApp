const comments = require('../models/comment.js');
const Post = require('../models/post.js')

const commentPost = async (req, res) => {
    try {
        const username = req.user
        if (!username) {
            res.status(500).json({ message: 'UnAuthorized. Please Login First!' });
        }
        const text = req.body.comment
        const post_id = req.params.id
        
        const newComment = new comments({
            body:text,
            post_id:post_id,
            username:username
        });
        await newComment.save();
        
        res.redirect(`/post/${post_id}`)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error in commentpost' });
    }
}
const commentGet = async (req, res) => {
    try {
        const postId = req.params.id;
        // Retrieve comments for the specified post from the database
        const comments = await comments.find({ post_id: postId }).populate('childrenComment');
        // res.render('comments', { comments });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}

const commentReply = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { reply } = req.body;
        const username = req.user; // Assuming user is logged in and username is available in req.user

        // Find the parent comment
        const parentComment = await comments.findById(commentId);

        // Create a new comment for the reply
        const newComment = new comments({
            post_id: parentComment.post_id,
            body: reply,
            username: username,
            parentComment: commentId // Set the parentComment field to the ID of the parent comment
        });
        // Save the new comment to the database.
        await newComment.save();

        // Push new comment in parent comment and save parent comment.
        parentComment.childrenComment.push(newComment)
        await parentComment.save();

       // Redirect back to the post page
        res.redirect(`/post/${parentComment.post_id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const editComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        // Sending the updated comment body in the request body
        const updatedCommentBody = req.body.updatedCommentBody; 
        const updatedComment = await comments.findByIdAndUpdate(commentId, { body: updatedCommentBody }, { new: true });
        const post_id = await comments.findById(commentId).post_id;
        res.redirect(`/post/${post_id}`);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.comment_id;
        const comment = await comments.findById(commentId)
        const post_id = comment.post_id

        await comments.findByIdAndDelete(commentId)

        res.redirect(`/post/${post_id}`);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
}


module.exports = {commentPost,commentGet,commentReply,editComment,deleteComment}