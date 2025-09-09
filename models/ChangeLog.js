const mongoose = require("mongoose");

const changeLogSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  fieldChanged: String,
  oldValue: String,
  newValue: String,
  changedBy: {
    type: String, // could be HR/Manager/Employee
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ChangeLog", changeLogSchema);
