var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");

require("dotenv").config();
var coursesRouter = require("./routes/instructorCourses");
var instructorRouter = require("./routes/instructors");
var coursesearchRouter = require("./routes/coursesearch");

var app = express();

// List of allowed origins (local and production domains)
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://anthonymartini.github.io", // QA domain
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/instructorCourses", coursesRouter);
app.use("/instructors", instructorRouter);
app.use("/coursesearch", coursesearchRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler without rendering an error view
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "An unexpected error occurred.";

  // Send JSON response for errors
  res.status(status).json({
    error: {
      message: message,
      status: status,
    },
  });
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});

module.exports = app;
