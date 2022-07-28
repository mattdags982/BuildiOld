"use strict";
const data = require("../model/project.model");
const User = require("../model/user.model");
const bcrypt = require("bcrypt");

//Creates a new project
const postProject = async (req, res) => {
  try {
    await data.Project.create({
      projectImage: req.file.path,
      name: req.body.name,
      description: req.body.description,
      bids: [],
    });
    res.status(202);
    res.send("success!");
  } catch (e) {
    res.status(504);
    console.log(e);
  }
};
//Return lists of all projects
const returnProjects = async (req, res) => {
  try {
    console.log("returning all projects");
    const projects = await data.Project.find();
    return res.status(200).send(projects);
  } catch (e) {
    console.log(e);
    res.status(505).send(e);
  }
};

const returnOneProject = async (req, res) => {
  try {
    const project = await data.Project.findById(req.query.id);
    console.log("returning one project");
    return res.status(200).send(project);
  } catch (e) {
    console.log(e);
    res.status(505).send(e);
  }
};

const addBid = async (req, res) => {
  try {
    console.log(req.body);
    const projectToUpdate = await data.Project.findByIdAndUpdate(
      req.body._id,
      {
        $push: {
          bids: { bidPrice: req.body.bidPrice },
        },
      },
      { new: true }
    );
    res.status(200).send(projectToUpdate);
  } catch (e) {
    console.log(e);
    res.status(505).send(e);
  }
};

const createUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    console.log("user exists =(");
    return res
      .status(409)
      .send({ error: "409", message: "User already exists" });
  }
  try {
    if (password === "") throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    const user = await newUser.save();
    // req.session.uid = user._id;
    console.log("user created!");
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send({ error, message: "Could not create user" });
  }
};

module.exports = {
  postProject,
  returnProjects,
  returnOneProject,
  addBid,
  createUser,
};
