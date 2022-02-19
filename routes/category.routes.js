const express = require("express");
const Category = require("../models/category.model");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("category/create");
});

router.post("/", async (req, res) => {
  await Category.create({
    name: req.body.name,
  });
  res.render("category/create");
});

module.exports = router;
