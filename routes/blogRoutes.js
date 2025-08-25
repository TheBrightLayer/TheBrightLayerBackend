// routes/blogRoutes.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const blogController = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Public routes (anyone can read blogs)
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/create", upload.single("cover"), blogController.createBlog);

// ✅ Protected routes (only admins can create, update, delete)
// router.post("/create", blogController.createBlog);
router.put("/:id", authMiddleware(["admin"]), blogController.updateBlog);
router.delete("/:id", authMiddleware(["admin"]), blogController.deleteBlog);

module.exports = router;
