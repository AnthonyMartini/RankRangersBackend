const express = require("express");

const app = express();

const sql = require("mssql");
require("dotenv").config();
// SQL Server configuration

/* GET instructor data by name */
app.get("/", async function (req, res) {
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

  const instructorName = req.query.name;

  if (!instructorName) {
    return res.status(400).json({ error: "Instructor name is required" });
  }

  try {
    // Connect to SQL Server and query by instructor name
    const pool = await sql.connect(config);
    const query = `SELECT TOP 10 instructor
FROM [dbo].[classdistributions]
WHERE instructor LIKE @instructorName
GROUP BY instructor ORDER BY INSTRUCTOR ASC`;
    const result = await pool
      .request()
      .input("instructorName", sql.NVarChar, `%${instructorName}%`)
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

module.exports = app;
