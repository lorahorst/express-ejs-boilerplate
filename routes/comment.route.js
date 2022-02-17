const express = require("express");
const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const router = express.Router();

router.post("/create/:id", async (req, res) => {
  // acquire the post
  const post = await Post.findById(req.params.id);
  // acquire the user
  const user = req.session.currentUser;
  // create the comment
  const comment = new Comment();
  comment.content = req.body.content;
  comment.author = user._id;
  await comment.save();
  // append the comment to the post
  post.comment.push(comment.id);
  await post.save();
  // redirect the user to the page of the commented post
  res.redirect(`/post/${post.id}`);
});

module.exports = router;
