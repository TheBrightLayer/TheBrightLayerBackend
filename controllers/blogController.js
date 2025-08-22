// controllers/blogController.js
const Blog = require("../models/Blog");

// @desc Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc Create new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newBlog = new Blog({
      title,
      content,
      mainImage: req.file ? req.file.path : null, // if using multer for image
      author: req.user.id, // 👈 take from token, not Postman
      authorProfileImage: req.user.profileImage || null, // optional
      category,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("CreateBlog Error:", err.message, err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// @desc Update blog
exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBlog) return res.status(404).json({ msg: "Blog not found" });
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ msg: "Blog not found" });
    res.json({ msg: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
