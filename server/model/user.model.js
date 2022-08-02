const mongoose = require("./index");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  review: String,
  creatorFirstName: String,
  creatorLastName: String,
  creatorPic: String,
});

const userSchema = mongoose.Schema({
  profilePic: String,
  email: String,
  password: String,
  userType: String,
  firstName: String,
  lastName: String,
  location: String,
  specialties: [String],
  reviews: [reviewSchema],
});

module.exports = mongoose.model("User", userSchema);
