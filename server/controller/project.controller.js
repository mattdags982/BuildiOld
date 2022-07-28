"use strict";
const data = require("../model/project.model");
const User = require("../model/user.model");
const bcrypt = require("bcrypt");

//Creates a new project
//Should return the created project (need to add this)
const postProject = async (ctx) => {
  try {
    await data.Project.create({
      projectImage: ctx.request.file.path,
      name: ctx.request.body.name,
      description: ctx.request.body.description,
      bids: [],
    });
    ctx.status = 202;
    ctx.body = "success!";
  } catch (e) {
    ctx.status = 504;
    console.log(e);
  }
};

//Return lists of all projects
const returnProjects = async (ctx) => {
  try {
    ctx.body = await data.Project.find();
    console.log("returning all projects");
    ctx.status = 200;
  } catch (e) {
    ctx.status = 505;
    ctx.body = e;
    console.log(e);
  }
};

const returnOneProject = async (ctx) => {
  try {
    ctx.body = await data.Project.findById(ctx.request.query.id);
    console.log("returning one project");
    ctx.status = 200;
  } catch (e) {
    ctx.status = 505;
    ctx.body = e;
    console.log(e);
  }
};

const addBid = async (ctx) => {
  try {
    console.log(ctx.request.body);
    ctx.body = await data.Project.findByIdAndUpdate(
      ctx.request.body._id,
      {
        $push: {
          bids: { bidPrice: ctx.request.body.bidPrice },
        },
      },
      { new: true }
    );
    ctx.status = 200;
  } catch (e) {
    ctx.status = 505;
    ctx.body = e;
    console.log(e);
  }
};

const createUser = async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await User.findOne({ email: email });
  if (user) {
    console.log("user exists =(");
    ctx.status = 409;
    ctx.body = { error: "409", message: "User already exists" };
    return;
  }
  try {
    if (password === "") throw new Error();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...ctx.request.body,
      password: hash,
    });
    const user = await newUser.save();
    ctx.cookies.set("uid", user_id, { httpOnly: false });
    console.log("user created!");
    ctx.status = 201;
    ctx.body = user;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error, message: "Could not create user" };
  }
};

module.exports = {
  postProject,
  returnProjects,
  returnOneProject,
  addBid,
  createUser,
};
