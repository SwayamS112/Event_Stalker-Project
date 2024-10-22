const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Set up body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/form")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Define the user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  userType: String, // can be 'student' or 'staff'
});

// Create the user model
const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/submit", (req, res) => {
  const { email, password, userType } = req.body;

  // Find the user in the MongoDB database
  User.findOne({ email, password, userType }, (err, user) => {
    if (err) {
      res.status(500).send("Server error");
    } else if (!user) {
      res.status(400).send("Invalid credentials");
    } else {
      // Redirect to the respective page based on userType
      if (userType === "student") {
        res.redirect("/student");
      } else if (userType === "staff") {
        res.redirect("/staff");
      }
    }
  });
});

// Route for student page
app.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stu.html"));
});

// Route for staff page
app.get("/staff", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test.html"));
});

// Route for add_event page
app.get("/add_event", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "addevent.html"));
});

// Route for displayevent page
app.get("/display_event", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "displayevent.html"));
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
