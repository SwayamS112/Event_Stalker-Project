const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Registration = require('./models/Registration');
const Login = require('./models/Login');
const Event = require('./models/Event');

// Initialize the express app
const app = express();

// Middleware setup - Ensure this is after app initialization
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); 
app.use(bodyParser.json({ limit: '50mb' }));  // increase limit for JSON data
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/login-page")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Root route to redirect to /login
app.get('/', (req, res) => {
  res.redirect('/login');
});


// Routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Registration route example
app.post("/register", async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const newUser = new Registration({ email, password, userType });
    await newUser.save();
    return res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error. Registration failed." });
  }
});

// Event upload route (corrected to match frontend)
app.post("/Add_Events", async (req, res) => {
  const { university, department, head, name, description, location, date, logo, link } = req.body;

  try {
    const newEvent = new Event({ university, department, head, name, description, location, date, logo, link });
    await newEvent.save();
    res.status(201).send("Event added successfully.");
  } catch (error) {
    console.log("Error adding event:", error);
    res.status(500).send("Internal server error.");
  }
});

// New route to fetch events from the database
app.get("/Display_Events", async (req, res) => {
  try {
    const events = await Event.find();  // Retrieve events from MongoDB
    res.json(events);  // Return events as JSON
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to load events" });
  }
});

// Add this route to app.js
app.get('/api/events', async (req, res) => {
  try {
      const events = await Event.find(); // Assuming `Event` is your Mongoose model
      res.json(events);
  } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).send("Error fetching events");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const user = await Registration.findOne({ email, userType });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const loginAttempt = new Login({
      email,
      password,
      userType,
      loginAttempts: [
        {
          timestamp: new Date(),
          credentials: { email, password },
        },
      ],
    });

    await loginAttempt.save();
    return res.json({ message: "Login successful", userType });
  } catch (err) {
    console.error("Error during login:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error" });
    }
  }
});

// Routes for other pages
app.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stu.html"));
});

app.get("/staff", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test.html"));
});

// Display Events page
app.get("/Display_Events", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "displayevent.html"));
});

// Add Events page
app.get("/Add_Events", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add_event.html"));
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
