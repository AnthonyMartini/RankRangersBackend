

const express = require("express");

const app = express();



app.get("/", (req, res) => {
  res.send(`Express on Vercel: ${process.env.NEXT_PUBLIC_DB_NAME}`);
  console.log(process.env.NEXT_PUBLIC_DB_NAME);

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
});


// Export the Express API
module.exports = app;