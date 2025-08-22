const express = require("express");
const { login, register } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected route - check user details from token
router.get("/profile", authMiddleware(), (req, res) => {
  res.json({
    msg: "User profile fetched successfully",
    user: req.user, // comes from decoded JWT
  });
});

module.exports = router;
