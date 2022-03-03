const express = require("express");
const { isLoggedIn } = require("../middlewares/guard");
const Category = require("../models/category.model");

const router = express.Router();

router.get("/create", isLoggedIn, (req, res) => {
  res.render("category/create");
});

router.post("/create", isLoggedIn, async (req, res) => {
  await Category.create({
    name: req.body.name,
  });
  res.render("category/create");
});

module.exports = router;
