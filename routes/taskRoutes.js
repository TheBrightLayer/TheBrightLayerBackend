const express = require("express");
const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTaskById, deleteTask } = require("../controllers/taskController");

// POST create task
router.post("/", createTask);

// GET all tasks
router.get("/", getAllTasks);

// GET task by Id
router.get("/:id",getTaskById);

// PUT task by ID
router.put("/:id",updateTaskById);

// DELETE task by ID
router.delete("/:id",deleteTask);

module.exports = router;
