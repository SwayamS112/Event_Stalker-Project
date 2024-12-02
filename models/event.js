const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  department: String,
  head: String,
  name: String,
  description: String,
  location: String,
  date: String,
  logo: String,
  link: String,
});

module.exports = mongoose.model("Event", eventSchema);
