const mongoose = require("./index");

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  bidPrice: Number,
});
const projectSchema = new Schema({
  projectImage: String,
  name: String,
  description: String,
  bids: [bidSchema],
});

//this actually creates the table and names it 'project'
module.exports.Project = mongoose.model("project", projectSchema);
