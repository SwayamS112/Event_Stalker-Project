const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["student", "staff"], // Ensure only "student" or "staff" are allowed
  },
});

registrationSchema.set("timestamps", true); // Automatically tracks created and updated times

// Create the Registration model
const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
