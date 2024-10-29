const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};
console.log("Database configuration:", config);

var app = express();

// List of allowed origins (local and production domains)
const allowedOrigins = [
  'http://localhost:3001',      // Local development
  'https://rank-rangers.vercel.app/' // Production domain
];
app.use(cors({
  origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
          return callback(null, true);
      } else {
          return callback(new Error('Not allowed by CORS'));
      }
  }
}));

app.get('/instructors', async function(req, res, next) {
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

app.get('/courses', async function(req, res, next) {
    const instructorName = req.query.name;

    if (!instructorName) {
        return res.status(400).json({ error: "Instructor name is required" });
    }

    try {
        // Connect to SQL Server and query by instructor name
        const pool = await sql.connect(config);
        const query = `SELECT * FROM [dbo].[classdistributions] WHERE INSTRUCTOR = @instructorName`;
        const result = await pool.request()
            .input('instructorName', sql.NVarChar, instructorName)
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

app.get('/coursesearch', async function(req, res, next) {
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




app.listen(config.port, ()=>{
    console.log(`Server started on port ${config.port}`)
})