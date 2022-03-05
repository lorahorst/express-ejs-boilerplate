const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { isLoggedIn } = require("../middlewares/guard");
const fileUploader = require("../cloudinary.config");

const router = express.Router();

// The sign in form
router.get("/register", (req, res) => {
  res.render("user/register");
});

// creates a user
router.post("/register", async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
  try {
    user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();
    res.redirect("/user/login");
  } catch (error) {
    res.redirect("/user/register");
  }
});

// The log in form
router.get("/login", (req, res) => {
  res.render("user/login");
});

// User authentication
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isPwCorrect = await bcrypt.compare(req.body.password, user.password);
    if (isPwCorrect) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.redirect("/user/login");
    }
  } catch (error) {
    res.redirect("/user/login");
  }
});

// The log out route
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
});

// The user's profile page
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("user/profile");
});


// route for handling the upload of the user picture
router.put("/profile/:id", isLoggedIn,
fileUploader.single("file"), async (req, res,) => {
  req.user = await User.findById(req.params.id)
  console.log(req.params.id)
  console.log(currentUser.id)
  req.user.image = req.file.path;
  req.user.imageName = req.file.originalname;
  try {
    await req.user.save();
    res.redirect("/post/myJournal");
  } catch (error) {
    res.redirect("/post/editPost");
  }
});


module.exports = router;
