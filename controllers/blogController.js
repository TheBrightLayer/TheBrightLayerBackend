const Blog = require("../models/Blog");
//const translateText = require("../utils/translateText"); // Import the translation utility

// controllers/blogController.js
const translateText = require("../utils/translateText"); // Import the new translation utility
//const Blog = require('../models/Blog');  // Import the Blog model

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    const translatedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        try {
          // Translate title and content
          const translatedTitle = await translateText(blog.title, "en", "hi"); // Translate title to Hindi
          const translatedContent = await translateText(
            blog.content,
            "en",
            "hi"
          ); // Translate content to Hindi

          // Return translated blog
          return {
            ...blog._doc, // Spread original blog data
            title: translatedTitle, // Translated title
            content: translatedContent, // Translated content
          };
        } catch (error) {
          console.error("Error translating blog:", error);
          return blog; // Return original blog data in case of failure
        }
      })
    );

    res.json(translatedBlogs); // Send the response with translated blogs
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc Get blog by ID
exports.getBlogById = async (req, res) => {
  const { lang = "en" } = req.query; // Default to 'en' (English)

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // If language is Hindi (hi), translate the content
    if (lang === "hi") {
      try {
        const translatedTitle = await translateText(blog.title, "en", "hi");
        const translatedContent = await translateText(blog.content, "en", "hi");
        const translatedCategory = await translateText(
          blog.category,
          "en",
          "hi"
        );

        return res.json({
          ...blog.toObject(),
          title: translatedTitle,
          content: translatedContent,
          category: translatedCategory,
        });
      } catch (error) {
        console.error("Error translating blog by ID:", error);
        return res.json(blog); // Return the blog without translation
      }
    }

    res.json(blog); // Send the blog in the default language
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
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
      mainImage: req.file ? req.file.path : null,
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
