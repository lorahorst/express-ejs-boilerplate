const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const router = express.Router();

// The post creation form
router.get("/create", isLoggedIn, (req, res) => {
  // const category = await Category.find()
  res.render("post/create");
});


// The post creation handler
router.post("/create", isLoggedIn, async (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.private = req.body.private;
  post.author = req.session.currentUser._id;
  try {
    await post.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/post/create");
  }
});

// Shows all posts
router.get("/viewAll", isLoggedIn, async (req, res) => {
  const posts = await Post.find({ author: req.session.currentUser._id });
  res.render("post/viewAll", { posts });
});

// Shows private posts
router.get("/viewPrivate", isLoggedIn, async (req, res) => {
  const posts = await Post.find({
    author: req.session.currentUser._id,
    private: true,
  });
  res.render("post/viewAll", { posts });
});

// Shows public posts
router.get("/viewPublic", isLoggedIn, async (req, res) => {
  const posts = await Post.find({ private: false });
  res.render("post/viewAll", { posts });
});

// Shows ONE post
router.get("/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("comments")
    .populate("author")
    .populate({
      path: "comments",
      populate: "author",
    });
  res.render("post/viewOne", { post });
});

module.exports = router;
