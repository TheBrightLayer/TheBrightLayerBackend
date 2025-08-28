const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // adjust if frontend deployed elsewhere
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Blog API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`⚡ Server running on http://localhost:${PORT}`)
);
