// controllers/employeeController.js
const connectDB = require("../config/db");

const couch = connectDB();
const db = couch.db.use("employees"); // make sure "employees" DB exists

// POST: Add new employee
exports.addEmployee = async (req, res) => {
  try {
    const response = await db.insert(req.body); // insert new doc
    res.status(201).json({ success: true, id: response.id, rev: response.rev });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET: Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const result = await db.list({ include_docs: true });
    const employees = result.rows.map(row => row.doc);
    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET: Get single employee by ID
exports.getEmployee = async (req, res) => {
  try {
    const employee = await db.get(req.params.id);
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).json({ success: false, message: "Employee not found" });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

// PUT: Update employee info
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await db.get(req.params.id); // fetch current doc
    const updated = { ...employee, ...req.body }; // merge updates
    const response = await db.insert(updated); // re-insert with _rev
    res.status(200).json({ success: true, id: response.id, rev: response.rev });
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).json({ success: false, message: "Employee not found" });
    } else {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

// DELETE: Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await db.get(req.params.id); // fetch doc
    await db.destroy(employee._id, employee._rev); // delete with rev
    res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).json({ success: false, message: "Employee not found" });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
