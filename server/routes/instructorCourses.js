const express = require("express");
const router = express.Router();
const sql = require("mssql");
require("dotenv").config();
// SQL Server configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};

/* GET instructor data by name */
router.get("/", async function (req, res, next) {
  const instructorName = req.query.name;

  if (!instructorName) {
    return res.status(400).json({ error: "Instructor name is required" });
  }

  try {
    // Connect to SQL Server and query by instructor name
    const pool = await sql.connect(config);
    const query = `
    SELECT * FROM [dbo].[classdistributions] 
    WHERE INSTRUCTOR = @instructorName 
    ORDER BY A DESC`;
    const result = await pool
      .request()
      .input("instructorName", sql.NVarChar, instructorName)
      .query(query);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the specified instructor." });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Database query error:", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while querying the database." });
  }
});

module.exports = router;
