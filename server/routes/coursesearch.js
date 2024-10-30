const express = require('express');
const router = express.Router();
const sql = require('mssql');
require('dotenv').config();
// SQL Server configuration
const config = {
    user: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    server: process.env.NEXT_PUBLIC_DB_SERVER,
    port: parseInt(process.env.NEXT_PUBLIC_DB_PORT, 10),
    database: process.env.NEXT_PUBLIC_DB_NAME,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};


/* GET instructor data by name */
router.get('/', async function(req, res, next) {
    const department = req.query.department;
    const courseCode = req.query.courseCode;

    if (!department) {
        return res.status(400).json({ error: "Department name is required" });
    }
    if (!courseCode) {
        return res.status(400).json({ error: "Course Code name is required" });
    }

    try {
        // Connect to SQL Server and query by instructor name
        const pool = await sql.connect(config);
        const query = `SELECT * FROM [dbo].[classdistributions] WHERE Department = @department AND Code = @courseCode`;
        const result = await pool.request()
            .input('department', sql.NVarChar, department).input('courseCode', sql.NVarChar, courseCode)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No records found for the specified query." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Database query error:", err.message);
        res.status(500).json({ error: "An error occurred while querying the database." });
    }
});

module.exports = router;
