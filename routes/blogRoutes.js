const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

// ---------- Public routes ----------
// Get all blogs
router.get("/", blogController.getAllBlogs);

// Get a blog by slug
router.get("/:slug", blogController.getBlogBySlug);

// ---------- Protected routes (admin only) ----------
// Create blog (with cover image upload)
router.post(
  "/create",
  authMiddleware(["admin"]),       // ensure only admin can create
  blogController.uploadCover, 
  blogController.createBlog
);

// Update blog by slug (need _id and _rev inside body or query)
router.put(
  "/:slug",
  authMiddleware(["admin"]),
  blogController.updateBlog
);

// Delete blog by slug (need _id and _rev inside body or query)
router.delete(
  "/:slug",
  authMiddleware(["admin"]),
  blogController.deleteBlog
);

module.exports = router;
