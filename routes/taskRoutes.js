const express = require("express");
const router = express.Router();
const { createTask, getAllTasks } = require("../controllers/taskController");

// POST create task
router.post("/", createTask);

// GET all tasks
router.get("/", getAllTasks);

module.exports = router;
