const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const CommentSchema = new Schema({
  post_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: "comments",
    default: null,
  },
  childrenComment: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
});

CommentSchema.pre("find", function (next) {
  this.populate({
    path: "childrenComment",
  });
  next();
});
const comments = new model("comments", CommentSchema);

module.exports = comments;
