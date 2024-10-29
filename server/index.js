require('dotenv').config();

const express = require('express');

const cors = require("cors");

const app = express();

app.use(express.json());
const corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.listen(5050, () => {
    console.log(`Server Started at ${5050}`)
})

//const routes = require('./routes/routes');
//app.use('/api', routes)