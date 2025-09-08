// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  department: String,
  role: { type: String, enum: ["Employee", "HR", "Manager"], default: "Employee" },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
