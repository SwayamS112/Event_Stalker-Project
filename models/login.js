const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["student", "staff"],
  },
  loginAttempts: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      credentials: {
        email: String,
        password: String,
      },
    },
  ],
});

loginSchema.set("timestamps", true); // Automatically tracks createdAt and updatedAt fields

const Login = mongoose.model("Login", loginSchema);
module.exports = Login;
