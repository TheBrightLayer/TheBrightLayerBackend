const slugify = require("slugify");
const translateText = require("../utils/translateText");
const multer = require("multer");
const nano = require("nano")(process.env.COUCHDB_URL);

// Database reference
const blogDB = nano.db.use("blog");

// ---------- Multer setup ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadCover = upload.single("cover");

// --------------------- GET ALL BLOGS ---------------------
// supports pagination & category filter
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, limit = 10, skip = 0 } = req.query;

    const selector = { type: "blog" };
    if (category) selector.category = category;

    const result = await blogDB.find({
      selector,
      sort: [{ createdAt: "desc" }],
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    // Translate blogs
    const translatedBlogs = await Promise.all(
      result.docs.map(async (blog) => {
        try {
          const translatedTitle = await translateText(blog.title, "en", "hi");
          const translatedContent = await translateText(blog.content, "en", "hi");
          return { ...blog, title: translatedTitle, content: translatedContent };
        } catch (err) {
          console.error("Translation error:", err);
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
    const result = await blogDB.find({ selector: { slug: req.params.slug, type: "blog" } });
    if (!result.docs.length) return res.status(404).json({ msg: "Blog not found" });

    const blog = result.docs[0];

    if (lang === "hi") {
      try {
        const translatedTitle = await translateText(blog.title, "en", "hi");
        const translatedContent = await translateText(blog.content, "en", "hi");
        const translatedCategory = await translateText(blog.category, "en", "hi");

        return res.json({
          ...blog,
          title: translatedTitle,
          content: translatedContent,
          category: translatedCategory,
        });
      } catch (err) {
        console.error("Translation error:", err);
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
    const { title, content, category, tags, metaTitle, metaDescription } = req.body;

    // Generate unique slug
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    let existing = await blogDB.find({ selector: { slug } });
    while (existing.docs.length > 0) {
      slug = `${baseSlug}-${counter++}`;
      existing = await blogDB.find({ selector: { slug } });
    }

    let imageBase64 = null;
    if (req.file && req.file.buffer) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const newBlog = {
      _id: `blog:${slug}`,
      type: "blog",
      title,
      content,
      category,
      slug,
      tags: tags ? JSON.parse(tags) : [],
      mainImage: imageBase64,
      metaTitle,
      metaDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await blogDB.insert(newBlog);
    res.status(201).json({ ...newBlog, _rev: response.rev });
  } catch (err) {
    console.error("CreateBlog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --------------------- UPDATE BLOG ---------------------
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await blogDB.get(id);
    if (!existing) return res.status(404).json({ msg: "Blog not found" });

    const updatedBlog = {
      ...existing,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    const response = await blogDB.insert(updatedBlog);
    res.json({ ...updatedBlog, _rev: response.rev });
  } catch (err) {
    console.error("UpdateBlog Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --------------------- DELETE BLOG ---------------------
exports.deleteBlog = async (req, res) => {
  try {
    const result = await blogDB.find({ selector: { slug: req.params.slug, type: "blog" } });
    if (!result.docs.length) return res.status(404).json({ msg: "Blog not found" });

    const blog = result.docs[0];
    await blogDB.destroy(blog._id, blog._rev);

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DeleteBlog Error:", err);
    res.status(500).json({ error: err.message });
  }
};
