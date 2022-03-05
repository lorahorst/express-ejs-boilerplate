const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Post = require("../models/post.model");
const Category = require("../models/category.model");
const fileUploader = require("../cloudinary.config");

const router = express.Router();

// The post creation form
router.get("/createPost", isLoggedIn, async (req, res) => {
  const post = new Post();
  const categories = await Category.find();
  res.render("post/createPost", { post, categories });
});

// The post creation handler
router.post(
  "/createPost",
  isLoggedIn,
  fileUploader.single("file"),
  async (req, res) => {
    const post = new Post();
    post.title = req.body.title;
    post.description = req.body.description;
    post.content = req.body.content;
    post.image = req.file.path;
    post.imageName = req.file.originalname;
    post.private = req.body.private;
    post.category = req.body.category;
    post.author = req.session.currentUser._id;
    try {
      await post.save();
      res.redirect("/post/myJournal");
    } catch (error) {
      res.redirect("/post/createPost");
    }
  }
);

// form for updating an existing post
router.get("/editPost/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const categories = await Category.find();
  if (req.session.currentUser._id === post.author._id.toString()) {
  res.render("post/editPost", { post, categories });
  }
});

// route for handling the update of an existing post
router.put("/editPost/:id", isLoggedIn,
fileUploader.single("file"), async (req, res, next) => {
  req.post = await Post.findById(req.params.id);
  req.post.title = req.body.title;
  req.post.description = req.body.description;
  req.post.content = req.body.content;
  req.post.image = req.file.path;
  req.post.imageName = req.file.originalname;
  req.post.private = req.body.private;
  req.post.category = req.body.category;
  req.post.author = req.session.currentUser._id;
  try {
    await req.post.save();
    res.redirect("/post/myJournal");
  } catch (error) {
    res.redirect("/post/editPost");
  }
});

// route for handling the deletion of a post
router.delete("/:id", isLoggedIn, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/post/myJournal");
});

// Shows all posts
router.get("/myJournal", isLoggedIn, async (req, res) => {
  const posts = await Post.find({ author: req.session.currentUser._id });
  res.render("post/myJournal", { posts });
});

// Shows private posts
router.get("/viewPrivate", isLoggedIn, async (req, res) => {
  const posts = await Post.find({
    author: req.session.currentUser._id,
    private: true,
  });
  res.render("post/myJournal", { posts });
});

// Shows public posts
router.get("/viewPublic", isLoggedIn, async (req, res) => {
  const posts = await Post.find({ private: false });
  res.render("post/myJournal", { posts });
});

// Search Page
router.get("/search", isLoggedIn, async (req, res) => {
  const categories = await Category.find();
  res.render("post/search", { categories });
 });
 
 // Route for handling the search
 router.post("/search", isLoggedIn, async (req, res) => {
  const posts = await Post.find({ category: { $all: [req.body.category]}, private: false });
  res.render("post/myJournal", { posts });
 });


// Shows ONE post
router.get("/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("category")
    .populate("comments")
    .populate("author")
    .populate({
      path: "comments",
      populate: "author",
    });
  res.render("post/viewOne", { post });
});

module.exports = router;