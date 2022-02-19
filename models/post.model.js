const mongoose = require("mongoose");

// here we can add sanitizedHTML

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  /* img: {
    type: String,
    required: true,
  }, */
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Refers to the User model
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  // Refers to the Comment model
  comments: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: "Comment",
  },
  private: {
    type: Boolean,
    default: false,
  },
  // Refers to the Category model
  category: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: "Category",
    required: true,
  },
});

// Exports the model and creates the "Post" collection in the database.
module.exports = mongoose.model("Post", postSchema);