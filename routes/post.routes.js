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
  async (req, res, next) => {
    req.post = new Post();
    req.file.path;
    req.file.originalname;
    next();
  },
  createPostAndRedirect("createPost")
);

// form for updating an existing post
router.get("/editPost/:id", isLoggedIn, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const categories = await Category.find();
  res.render("post/editPost", { post, categories });
});

// route for handling the update of an existing post
router.put(
  "/:id",
  async (req, res, next) => {
    req.post = await Post.findById(req.params.id);
    next();
  },
  createPostAndRedirect("editPost")
);

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

function createPostAndRedirect(template) {
  return async (req, res) => {
    console.log(req.file);
    req.post.title = req.body.title;
    req.post.description = req.body.description;
    req.post.content = req.body.content;
    req.post.private = req.body.private;
    req.post.category = req.body.category;
    req.post.author = req.session.currentUser._id;
    try {
      await req.post.save();
      res.redirect("/");
    } catch (error) {
      res.render(template, { post: req.post });
    }
  };
}

module.exports = router;
