"use strict";
const data = require("../model/project.model");
const User = require("../model/user.model");
const bcrypt = require("bcrypt");

//Creates a new project
const postProject = async (req, res) => {
  try {
    console.log(req.body);
    await data.Project.create({
      projectImage: req.file.path,
      name: req.body.name,
      description: req.body.description,
      userId: req.body._id,
      specialties: req.body.specialties.split(","),
      lifeCycle: "open",
      bids: [],
      rfis: [],
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

//BIDS
const addBid = async (req, res) => {
  try {
    const projectToUpdate = await data.Project.findByIdAndUpdate(
      req.body._id,
      {
        $push: {
          bids: {
            bidPrice: req.body.bidPrice,
            creatorId: req.body.creatorId,
            creatorName: req.body.creatorName,
            creatorPic: req.body.creatorPic,
            awarded: false,
          },
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

const changeBid = async (req, res) => {
  try {
    const projectToUpdate = await data.Project.findOneAndUpdate(
      { _id: req.body._id, "bids.creatorId": req.body.creatorId },
      {
        $set: {
          "bids.$.bidPrice": req.body.bidPrice,
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
//will update awarded bid status and also set project life cycle to awarded
const awardBid = async (req, res) => {
  console.log("here");
  try {
    let projectToUpdate = await data.Project.findOneAndUpdate(
      { _id: req.body._id, "bids.creatorId": req.body.creatorId },
      {
        $set: {
          "bids.$.awarded": true,
        },
      },
      { new: true }
    );

    projectToUpdate = await data.Project.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          lifeCycle: "awarded",
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

//RFIS
const addRFI = async (req, res) => {
  try {
    const projectToUpdate = await data.Project.findByIdAndUpdate(
      req.body._id,
      {
        $push: {
          rfis: {
            question: req.body.question,
            response: "",
            creatorId: req.body.creatorId,
            creatorPic: req.body.creatorPic,
          },
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

const respondRFI = async (req, res) => {
  console.log("got");
  try {
    const projectToUpdate = await data.Project.findOneAndUpdate(
      { _id: req.body._id, "rfis._id": req.body.rfiId },
      {
        $set: {
          "rfis.$.response": req.body.response,
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

//USER FUNCTIONS

const createReview = async (req, res) => {
  try {
    //first leave the review
    const userToLeaveReviewOn = await User.findByIdAndUpdate(
      req.body.bidderId,
      {
        $push: {
          reviews: {
            rating: req.body.rating,
            review: req.body.review,
            creatorFirstName: req.body.creatorFirstName,
            creatorLastName: req.body.creatorLastName,
            creatorPic: req.body.creatorPic,
          },
        },
      },
      { new: true }
    );
    //next change the project status to closed
    const projectToClose = await data.Project.findOneAndUpdate(
      { _id: req.body.projectId },
      {
        $set: {
          lifeCycle: "closed",
        },
      },
      { new: true }
    );

    console.log(req.body);

    res.status(200).send(userToLeaveReviewOn);
  } catch (e) {
    console.log(e);
    res.status(505).send(e);
  }
};

const createUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    console.log("user already exists! Please register as a new user.");
    return res
      .status(409)
      .send({ error: "409", message: "User already exists =(" });
  }
  try {
    if (password === "") throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      profilePic: req.file.path,
      specialties: req.body.specialties.split(","),
      reviews: [],
      password: hash,
    });
    console.log(newUser);
    const user = await newUser.save();
    console.log(user);
    req.session.uid = user._id;
    res.status(201).send(user);
  } catch (error) {
    res
      .status(400)
      .send({ error, message: "Error, could not create a new user =(" });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
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
//This version uses auth middleware for logged in user
const profile = async (req, res) => {
  try {
    const {
      _id,
      profilePic,
      firstName,
      lastName,
      userType,
      location,
      email,
      specialties,
      reviews,
    } = req.user;
    const user = {
      _id,
      profilePic,
      firstName,
      lastName,
      userType,
      location,
      email,
      specialties,
      reviews,
    };
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ error, message: "User not found" });
  }
};

//This version is to obtain profile details of another user, without changing the authorized user (to view someone elses profile)
//UPDATE LATER SO YOU DO NOT SEND BACK ANY SENSITIVE INFO (IF YOU HAVE TIME)
const getOtherProfile = async (req, res) => {
  try {
    console.log("made it");
    console.log(req.query.id);
    const otherUser = await User.findById(req.query.id);
    res.status(200).send(otherUser);
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
  changeBid,
  awardBid,
  addRFI,
  respondRFI,
  createUser,
  login,
  profile,
  getOtherProfile,
  logout,
  createReview,
};
