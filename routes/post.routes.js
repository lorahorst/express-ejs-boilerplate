const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Post = require("../models/post.model");
const Category = require("../models/category.model");
const File = require("../models/file.model");
const fileUploader = require("../cloudinary.config");

const router = express.Router();

// The post creation form
router.get("/create", isLoggedIn, async (req, res) => {
  const images = await File.find();
  const categories = await Category.find();
  res.render("post/create", { images, categories });
});

// The post creation handler
router.post(
  "/create",
  isLoggedIn,
  fileUploader.single("file"),
  async (req, res) => {
    const post = new Post();
    post.title = req.body.title;
    post.content = req.body.content;
    post.img = req.body.img;
    post.private = req.body.private;
    post.category = req.body.category;
    post.author = req.session.currentUser._id;
    try {
      await File.create({
        name: req.file.originalname,
        url: req.file.path,
      });
      await post.save();
      res.redirect("/");
    } catch (error) {
      res.redirect("/post/create");
    }
  }
);

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

module.exports = router;
