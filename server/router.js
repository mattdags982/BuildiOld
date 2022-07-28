//CAHNGED
// const Router = require("@koa/router");
const router = require("express").Router();
//REMOVE
// const router = new Router();
const projectController = require("./controller/project.controller");
//multer is for incoming form data
//CHANGE
// const multer = require("@koa/multer");
const multer = require("multer");

//configures how multer stores files. More detailed than just using dest
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
//note that I can use multer to filter by file types, only accept certain file sizes, etc.
//creates a multer instance
const upload = multer({ storage: storage });
//create project
router.post(
  "/create",
  upload.single("projectImage"),
  projectController.postProject
);
//add bid to a specific project
router.post("/bid", projectController.addBid);
//return all prjects
router.get("/projects", projectController.returnProjects);
//return specific project for details page
router.get("/oneProject", projectController.returnOneProject);

router.post("/register", projectController.createUser);

module.exports = router;
