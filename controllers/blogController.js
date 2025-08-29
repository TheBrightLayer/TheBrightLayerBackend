// controllers/blogController.js
const Blog = require("../models/Blog");
const translateText = require("../utils/translateText"); // translation utility
const multer = require("multer");

// ---------- Multer setup for handling cover image ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle 'cover' file
exports.uploadCover = upload.single("cover");

// --------------------- GET ALL BLOGS ---------------------
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, limit } = req.query;
    const query = category ? { category } : {};
    let blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

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
          return blog;
        }
      })
    );

    res.json(translatedBlogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --------------------- GET BLOG BY SLUG ---------------------
exports.getBlogBySlug = async (req, res) => {
  const { lang = "en" } = req.query;

  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

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
        return res.json(blog);
      }
    }

    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog by slug:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --------------------- CREATE BLOG ---------------------
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    let imageBase64 = null;
    if (req.file && req.file.buffer) {
      imageBase64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      tags: tags ? JSON.parse(tags) : [],
      mainImage: imageBase64,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("CreateBlog Error:", err.message, err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// --------------------- UPDATE BLOG ---------------------
exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBlog) return res.status(404).json({ msg: "Blog not found" });
    res.json(updatedBlog);
  } catch (err) {
    console.error("UpdateBlog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --------------------- DELETE BLOG ---------------------
// controllers/blogController.js
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

