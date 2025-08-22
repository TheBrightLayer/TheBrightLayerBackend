const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const categoryController = require("../controllers/categoryController");

// Create category (admin only)
router.post(
  "/create",
  authMiddleware(["admin"]),
  upload.single("image"),
  categoryController.createCategory
);

// Get all categories
router.get("/", categoryController.getCategories);

// ✅ Get blogs by category
router.get("/:id/blogs", categoryController.getBlogsByCategory);

module.exports = router;
