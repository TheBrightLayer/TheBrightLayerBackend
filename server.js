const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors"); // ✅ import CORS

dotenv.config();
connectDB();

const app = express();

// ✅ CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json()); // parses JSON body
app.use(express.urlencoded({ extended: true })); // parses form-urlencoded

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/categories", categoryRoutes);
// In app.js or server.js
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("🚀 Blog API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`⚡ Server running on http://localhost:${PORT}`)
);
