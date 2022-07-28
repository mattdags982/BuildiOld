const mongoose = require("./index");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
});

//this actually creates the table and names it 'project'
module.exports = mongoose.model("User", userSchema);
