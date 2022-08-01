const mongoose = require("./index");

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  bidPrice: Number,
  creatorId: String,
  creatorName: String,
  creatorPic: String,
  awarded: Boolean,
});

const RFISchema = new Schema({
  question: String,
  response: String,
  creatorId: String,
});

const projectSchema = new Schema({
  projectImage: String,
  name: String,
  description: String,
  userId: String,
  specialties: [String],
  lifeCycle: String,
  bids: [bidSchema],
  rfis: [RFISchema],
});

//this actually creates the table and names it 'project'
module.exports.Project = mongoose.model("project", projectSchema);
