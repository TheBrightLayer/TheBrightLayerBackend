const Blog = require("../models/Blog");
//const translateText = require("../utils/translateText"); // Import the translation utility

// controllers/blogController.js
const translateText = require("../utils/translateText"); // Import the new translation utility
//const Blog = require('../models/Blog');  // Import the Blog model

exports.getAllBlogs = async (req, res) => {
  try {
    const { category, limit } = req.query;

    // Build query object
    const query = category ? { category } : {};

    // Fetch blogs with optional filter + limit
    let blogs = await Blog.find(query)
      .sort({ createdAt: -1 }) // latest first
      .limit(limit ? parseInt(limit) : 0);

    // Translate blogs (your existing logic)
    const translatedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        try {
          const translatedTitle = await translateText(blog.title, "en", "hi");
          const translatedContent = await translateText(
            blog.content,
            "en",
            "hi"
          );

          return {
            ...blog._doc,
            title: translatedTitle,
            content: translatedContent,
          };
        } catch (error) {
          console.error("Error translating blog:", error);
          return blog; // fallback: return original
        }
      })
    );

    res.json(translatedBlogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc Get blog by ID
// exports.getBlogById = async (req, res) => {
//   const { lang = "en" } = req.query; // Default to 'en' (English)

//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ msg: "Blog not found" });

//     // If language is Hindi (hi), translate the content
//     if (lang === "hi") {
//       try {
//         const translatedTitle = await translateText(blog.title, "en", "hi");
//         const translatedContent = await translateText(blog.content, "en", "hi");
//         const translatedCategory = await translateText(
//           blog.category,
//           "en",
//           "hi"
//         );

//         return res.json({
//           ...blog.toObject(),
//           title: translatedTitle,
//           content: translatedContent,
//           category: translatedCategory,
//         });
//       } catch (error) {
//         console.error("Error translating blog by ID:", error);
//         return res.json(blog); // Return the blog without translation
//       }
//     }

//     res.json(blog); // Send the blog in the default language
//   } catch (err) {
//     console.error("Error fetching blog by ID:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

exports.getBlogBySlug = async (req, res) => {
  const { lang = "en" } = req.query; // Default language = English

  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // ✅ If Hindi requested, translate fields
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
        console.error("Error translating blog by slug:", error);
        return res.json(blog); // fallback: return original blog
      }
    }

    res.json(blog); // Default English
  } catch (err) {
    console.error("Error fetching blog by slug:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc Create new blog
// exports.createBlog = async (req, res) => {
//   try {
//     const { title, content, category } = req.body;

//     const newBlog = new Blog({
//       title,
//       content,
//       mainImage: req.file ? req.file.path : null,
//       category,
//     });

//     await newBlog.save();
//     res.status(201).json(newBlog);
//   } catch (err) {
//     console.error("CreateBlog Error:", err.message, err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };
// @desc Create new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    let imageBase64 = null;
    if (req.file) {
      imageBase64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    const newBlog = new Blog({
      title,
      content,
      mainImage: imageBase64, // ✅ store Base64 instead of path
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
