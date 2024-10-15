// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const jwt_secret = process.env.JWT_SECRET;

const checkLoginState = async (req, res, next) => {

    const token = req.cookies.token;
    if (token === undefined) {
        next();
    } else if (token) {
        try {
            const decoded = jwt.verify(token, jwt_secret);
            req.userId = decoded.userId;
            const user = await User.findById(req.userId);
            req.userPosts = await Post.find({ username: { $eq: user.username } });
            req.user = user.username;
            
        } catch (error) {
            res.clearCookie('token');
        }
        next();
    } else {
        next();
    }
};

module.exports = checkLoginState;
