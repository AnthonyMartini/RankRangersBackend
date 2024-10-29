var express = require('express');
var router = express.Router();

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

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});


module.exports = router;
