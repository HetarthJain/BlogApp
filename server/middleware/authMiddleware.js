// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const jwt_secret = process.env.JWT_SECRET;

const checkLoginState = async (req, res, next) => {
    const token = req.cookies.token || req.session.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, jwt_secret);
            req.userId = decoded.userId;
            const user = await User.findById(req.userId);
            if (user) {
				req.userPosts = await Post.find({ username: user.username })
				req.user = user
            }
        } catch (error) {
            req.session.destroy();
            res.clearCookie('token');
        }
    }
    next();
};

module.exports = checkLoginState;
