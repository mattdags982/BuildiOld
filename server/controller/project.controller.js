"use strict";
const data = require("../model/project.model");

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

module.exports = { postProject, returnProjects, returnOneProject, addBid };
