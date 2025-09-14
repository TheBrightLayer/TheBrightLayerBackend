// controllers/taskController.js
const connectDB = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const couch = connectDB();
const taskDB = couch.db.use("task"); // ✅ using Task DB explicitly

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, status } = req.body;

    const newTask = {
      _id: uuidv4(),
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      status: status || "To Do",
      createdAt: new Date()
    };

    const response = await taskDB.insert(newTask);
    res.status(201).json({ success: true, data: { ...newTask, _rev: response.rev } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const result = await taskDB.list({ include_docs: true });
    const tasks = result.rows.map(row => row.doc);

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskDB.get(id);

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Task by ID
exports.updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingTask = await taskDB.get(id);

    const updatedTask = { ...existingTask, ...req.body };
    const response = await taskDB.insert(updatedTask);

    res.status(200).json({ success: true, data: { ...updatedTask, _rev: response.rev } });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Task by ID
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskDB.get(id);

    await taskDB.destroy(task._id, task._rev);

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
