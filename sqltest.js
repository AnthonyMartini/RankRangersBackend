require('dotenv').config();  // Load environment variables from .env file
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),  // Convert to integer
    database: process.env.DB_NAME,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};

console.log("Starting...");
connectAndQuery();

async function connectAndQuery() {
    try {
        const poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        const resultSet = await poolConnection.request().query(`
            SELECT * FROM [dbo].[classDist] WHERE INSTRUCTOR = 'A. Ceccon';
        `);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // Output column headers
        let columns = "";
        for (const column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // Output row contents from default record set
        resultSet.recordset.forEach(row => {
            console.log("%s\t%s", row.CRN, row.TITLE);
        });

        // Close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}
