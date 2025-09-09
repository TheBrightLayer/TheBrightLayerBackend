const express = require("express");
const router = express.Router();
const { getChangeLogs } = require("../controllers/changeLogController");

// GET change log by employeeId
router.get("/:employeeId", getChangeLogs);

module.exports = router;
