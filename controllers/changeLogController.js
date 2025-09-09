const ChangeLog = require("../models/ChangeLog");

// Get change logs by employeeId
exports.getChangeLogs = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const logs = await ChangeLog.find({ employeeId }).sort({ changedAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
