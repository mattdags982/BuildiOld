const mongoose = require("./index");

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  userType: String,
  firstName: String,
  lastName: String,
});

//this actually creates the table and names it 'project'
module.exports = mongoose.model("User", userSchema);
