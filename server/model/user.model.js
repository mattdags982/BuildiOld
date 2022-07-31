const mongoose = require("./index");

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  profilePic: String,
  // profilePic: { type: String, required: false },
  email: String,
  password: String,
  userType: String,
  firstName: String,
  lastName: String,
  location: String,
  specialties: [String],
});

//this actually creates the table and names it 'project'
module.exports = mongoose.model("User", userSchema);
