

const express = require("express");

const app = express();



app.get("/", (req, res) => {
  res.send(`Express on Vercel: ${process.env.NEXT_PUBLIC_DB_NAME}`);
  console.log(process.env.NEXT_PUBLIC_DB_NAME);
});


// Export the Express API
module.exports = app;