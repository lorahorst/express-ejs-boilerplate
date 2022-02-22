const express = require("express");
const Category = require("../models/category.model");

const router = express.Router();

router.get("/create", (req, res) => {
  res.render("category/create");
});

router.post("/create", async (req, res) => {
  await Category.create({
    name: req.body.name,
  });
  res.render("category/create");
});

module.exports = router;
