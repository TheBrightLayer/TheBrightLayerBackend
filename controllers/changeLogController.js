const nano = require("nano")(process.env.COUCHDB_URL);
const changeLogDB = nano.db.use("changelogs"); // make sure the DB exists

// ✅ Get change logs by employeeId
exports.getChangeLogs = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Query using Mango selector
    const result = await changeLogDB.find({
      selector: { employeeId },
      sort: [{ changedAt: "desc" }],
    });

    res.status(200).json({ success: true, data: result.docs });
  } catch (error) {
    console.error("Error fetching change logs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
