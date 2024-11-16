const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Registration = require('./models/Registration');
const Login = require('./models/Login');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); 
console.log('Resolved path to login.html:', path.join(__dirname, 'public', 'login.html'));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/login-page")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Root route to redirect to /login
app.get('/', (req, res) => {
  res.redirect('/login'); // Redirects to the login page
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
