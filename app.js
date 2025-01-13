require("dotenv").config(); // Load environment variables from the .env file
const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/insertstd");

const app = express();

// Middleware to ensure `db` is initialized before handling requests
const ensureDbConnection = (req, res, next) => {
  if (!mongoose.connection.readyState) {
    return res
      .status(503)
      .json({ message: "Database not connected yet. Try again later." });
  }
  req.db = mongoose.connection; // Attach the database object to the request
  next();
};

// Get the database URL from the .env file
const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database connected");
    app.listen(2000, () => {
      console.log("MongoDB app is running on port 2000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if the DB connection fails
  });

// Middleware for static files
app.use(express.static(__dirname + "/public"));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route with database middleware
app.use("/", ensureDbConnection, studentRoutes);
