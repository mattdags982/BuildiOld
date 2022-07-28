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
      userId: req.body._id,
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
    const projects = await data.Project.find();
    return res.status(200).send(projects);
  } catch (e) {
    console.log(e);
    res.status(505).send(e);
  }
};

//Return list of projects specific to a user
const returnProjectsById = async (req, res) => {
  try {
    console.log("param id:", req.query.id);
    // const projects = await data.Project.find({ userId: req.user._id });
    // return res.status(200).send(projects);
  } catch (e) {
    console.log(e);
    res.status(505).send(e);
  }
};

const returnOneProject = async (req, res) => {
  try {
    const project = await data.Project.findById(req.query.id);
    return res.status(200).send(project);
  } catch (e) {
    console.log(e);
    res.status(505).send(e);
  }
};

const addBid = async (req, res) => {
  try {
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
    req.session.uid = user._id;
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send({ error, message: "Could not create user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const validatedPass = await bcrypt.compare(password, user.password);
    if (!validatedPass) throw new Error();
    req.session.uid = user.id;
    console.log("logged in!");
    res.status(200).send(user);
  } catch (error) {
    res
      .status(401)
      .send({ error: "401", message: "Username or password is incorrect" });
  }
};

const profile = async (req, res) => {
  try {
    console.log("prof req user", req.user);
    const { _id, firstName, lastName, userType } = req.user;
    const user = { _id, firstName, lastName, userType };
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ error, message: "User not found" });
  }
};

const logout = (req, res) => {
  console.log("entered logout controller function");
  req.session.destroy((error) => {
    if (error) {
      res
        .status(500)
        .send({ error, message: "Could not log out, please try again" });
    } else {
      res.clearCookie("sid");
      res.status(200).send({ message: "Logout successful" });
    }
  });
};

module.exports = {
  postProject,
  returnProjects,
  returnProjectsById,
  returnOneProject,
  addBid,
  createUser,
  login,
  profile,
  logout,
};
