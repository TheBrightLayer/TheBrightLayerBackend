// config/db.js
const nano = require("nano");

let couch;

const connectDB = () => {
  try {
    // CouchDB connection (using env vars)
    couch = nano(process.env.COUCHDB_URL); // e.g. http://admin:password@127.0.0.1:5984

    console.log("✅ Connected to CouchDB");
    return couch;
  } catch (error) {
    console.error("❌ CouchDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
