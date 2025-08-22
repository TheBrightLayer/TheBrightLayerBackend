const Category = require("../models/Category");
const Blog = require("../models/Blog");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const category = new Category({ name, description, image });
    await category.save();

    res.json({ msg: "✅ Category created", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get all blogs in a category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await Blog.find({ category: id })
      .populate("author", "name email") // only return name + email of author
      .populate("category", "name"); // return category name

    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
