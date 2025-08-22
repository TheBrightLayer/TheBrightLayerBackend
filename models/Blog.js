const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    mainImage: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorProfileImage: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // ✅ link blog to category
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
