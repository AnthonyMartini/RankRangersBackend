const express = require("express");

const app = express();


const sql = require('mssql');
require('dotenv').config();
// SQL Server configuration


/* GET instructor data by name */
app.get("/", (req, res) => {
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
    console.log(config);
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
GROUP BY instructor`;
        const result = await pool.request()
        .input('instructorName', sql.NVarChar, `%${instructorName}%`)
        .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No records found for the specified instructor." });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Database query error:", err.message);
        res.status(500).json({ error: "An error occurred while querying the database." });
    }
});

module.exports = app;
