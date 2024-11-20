const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const Registration = require("./models/Registration");
const Login = require("./models/Login");
const Event = require("./models/Event");

const app = express();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "public", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/login-page")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes

// Redirect to login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Registration route
app.post("/register", async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const newUser = new Registration({ email, password, userType });
    await newUser.save();
    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error. Registration failed." });
  }
});

// Add event route
app.post("/Add_Events", upload.single("logo"), async (req, res) => {
  console.log("Request body:", req.body);  // Log form data
  console.log("Uploaded file:", req.file); // Log file data

  const { university, department, head, name, description, location, date, link } = req.body;
  const logo = req.file ? req.file.filename : null; // Get the uploaded file's filename

  try {
    const newEvent = new Event({
      university,
      department,
      head,
      name,
      description,
      location,
      date,
      logo, // File path of the uploaded logo
      link
    });

    await newEvent.save();
    console.log("Event added successfully:", newEvent);
    res.status(201).send("Event added successfully.");
  } catch (error) {
    console.log("Error adding event:", error); // Log detailed error message
    res.status(500).send("Internal server error.");
  }
});

// Fetch all events
app.get("/Display_Events", async (req, res) => {
  try {
    const events = await Event.find({});
    console.log("Found events:", events); // Add this log
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to load events" });
  }
});

// Delete an event by ID
app.delete("/Delete_Event/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    await Event.findByIdAndDelete(eventId);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const user = await Registration.findOne({ email, userType });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const existingLogin = await Login.findOne({ email, userType });
    if (existingLogin) {
      existingLogin.loginAttempts.push({ timestamp: new Date(), credentials: { email, password } });
      await existingLogin.save();
    } else {
      const newLoginAttempt = new Login({
        email,
        password,
        userType,
        loginAttempts: [{ timestamp: new Date(), credentials: { email, password } }],
      });
      await newLoginAttempt.save();
    }

    res.json({ message: "Login successful", userType });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve pages for student and staff
app.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stu.html"));
});

app.get("/staff", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test.html"));
});

// Serve the add events page
app.get("/Add_Events", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add_event.html"));
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
