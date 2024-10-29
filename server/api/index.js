const express = require("express");
const app = express();

var indexRouter = require('./routes/index');
var coursesRouter = require('./routes/courses');
var instructorRouter = require('./routes/instructors');
var coursesearchRouter = require('./routes/coursesearch');

app.get("/", (req, res) => res.send("Express on Vercel"));
app.use('/', indexRouter);
app.use('/courses', coursesRouter);
app.use('/instructors', instructorRouter);
app.use('/coursesearch', coursesearchRouter);

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;

