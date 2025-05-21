const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const Registration = require("./models/registration");
const Login = require("./models/Login");
const Event = require("./models/Event");
const app = express();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose
mongoose.connect("mongodb://localhost:27017/login-page")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes

// Redirect to login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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

// Route to save an event for a user
app.post('/savedEvents/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { userEmail } = req.body;

  try {
    const user = await Registration.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.savedEvents.includes(eventId)) {
      return res.status(400).json({ message: 'Event already saved' }); 
    }

    user.savedEvents.push(eventId);
    await user.save();

    res.json({ message: 'Event saved successfully' });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ message: 'Failed to save event' });
  }
});

// Add an event
app.post("/Add_Events", upload.single("logo"), async (req, res) => {
  try {
    const eventData = {
      name: req.body.name,
      department: req.body.department,
      head: req.body.head,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description,
      link: req.body.link,
      logo: req.file ? req.file.filename : "default-event-image.jpg",
    };

    const newEvent = new Event(eventData);
    await newEvent.save();
    res.send("Event added successfully!");
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Failed to add the event." });
  }
});


// Fetch all events
// display event route
app.get("/Display_Events", async (req, res) => {
  try {
    const events = await Event.find({}); 
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to load events." });
  }
});


// Delete an event
app.delete("/Delete_Event/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event." });
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

// Serve additional pages
app.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "stu.html"));
});

app.get("/staff", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test.html"));
});

app.get("/Add_Events", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add_event.html"));
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
