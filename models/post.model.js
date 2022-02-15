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
  img: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  comments: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
    ref: "Comment",
  },
  private: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
});
