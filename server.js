const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
// Body parser middleware
app.use(express.json()); // 👈 parses JSON body
app.use(express.urlencoded({ extended: true })); // 👈 parses form-urlencoded
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.get("/", (req, res) => {
  res.send("🚀 Blog API running...");
});

app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`⚡ Server running on http://localhost:${PORT}`)
);
