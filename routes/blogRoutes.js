// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Public routes (anyone can read blogs)
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

// ✅ Protected routes (only admins can create, update, delete)
router.post("/create", authMiddleware(["admin"]), blogController.createBlog);
router.put("/:id", authMiddleware(["admin"]), blogController.updateBlog);
router.delete("/:id", authMiddleware(["admin"]), blogController.deleteBlog);

module.exports = router;
