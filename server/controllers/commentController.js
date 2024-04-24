const comments =  require('../models/comment.js')

const commentPost = async (req, res) => {
    try {
        const username = req.user.username
        if (!username) {
            res.status(500).json({ message: 'unAuthorized. Please Login First!' });
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
        // console.log('Comment created successfully',newComment)
        // res.status(201).json({ message: 'Comment created successfully', comment: newComment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
const commentGet = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId)
        // Retrieve comments for the specified post from the database
        const comments = await comments.find({ post_id: postId }).populate('childrenComment');
        res.render('comments', { comments });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}

const commentReply = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { reply } = req.body;
        const username = req.user.username; // Assuming user is logged in and username is available in req.user

        // Find the parent comment
        const parentComment = await comments.findById(commentId);

        // Create a new comment for the reply
        const newComment = new comments({
            post_id: parentComment.post_id,
            body: reply,
            username: username,
            parentComment: commentId // Set the parentComment field to the ID of the parent comment
        });

        parentComment.childrenComment.push(newComment)
        await parentComment.save();
        console.log(parentComment);

        // Save the new comment to the database
        await newComment.save();

        res.redirect(`/post/${parentComment.post_id}`); // Redirect back to the post page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = {commentPost,commentGet,commentReply}