const { default: mongoose } = require("mongoose");
const Task = require("../models/Tasks");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;

    const newTask = new Task({ title, description, priority, dueDate, assignedTo });
    await newTask.save();

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Task ID" });
    }

    // Find the task
    const task = await Task.findById(id).populate("assignedTo", "name email department");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" }); // use 404 instead of 400
    }

    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    console.error("❌ Error in getTaskById:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update the task by Id
exports.updateTeskById = async (req, res) => {
  try{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({ success: false, message: "Invalid Task ID" });
    }

    const updateTask = await Task.findByIdAndUpdate(id, req.body, {new: true, renValidator: true}).populate("assignedTo", "name email department");

    if(!updateTask){
      return res.status(404).json({success: false, message: "Task not found"});
    }

    return res.status(200).json({success: true, data: updateTask});
  } catch (err) {
    console.error("Error in update Task: ", err);
    return res.status(500).json({success: false, message: "Server Error"});
  }
}

// Delete Task by Id
exports.deleteTask = async (req, res) => {
  try{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message: "Invalid Task Id"});
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if(!deletedTask){
      return res.status(400).json({message: "Task not found"});
    }

    console.log(`Task deleted with Id: ${id}`);
    res.status(200).json({message: "Task deleted Successfully",deletedTask});
  } catch(err) {
    console.error("Error deleting task",error);
    res.status(500).json({message: "Internal Server error"});
  }
};