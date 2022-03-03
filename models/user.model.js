const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  imageName: {
    type: String,
  },
});

// Exports the model and creates the "User" collection in the database.
module.exports = mongoose.model("User", userSchema);
