//REQUIRES
const router = require("express").Router();
const projectController = require("./controller/project.controller");
//multer is for incoming form data
const multer = require("multer");
const authMiddleware = require("./middlewares/auth");
//SETUP / CONFIG
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
//ROUTES
//create project
router.post(
  "/create",
  upload.single("projectImage"),
  projectController.postProject
);
//Bids
router.post("/bid", projectController.addBid);
router.post("/editbid", projectController.changeBid);
router.post("/awardbid", projectController.awardBid);
//RFI's
router.post("/RFI", projectController.addRFI);
router.post("/RFIrespond", projectController.respondRFI);

//return all projects
router.get("/projects", projectController.returnProjects);
//return projects specific to a user
router.get("/userprojects", projectController.returnProjectsById);
//return specific project for details page
router.get("/oneProject", projectController.returnOneProject);
//USER ROUTES
//leave review
router.post("/review", projectController.createReview);

//auth routes
router.post(
  "/register",
  upload.single("profilePic"),
  projectController.createUser
);
router.post(
  "/login",
  upload.single(
    "formData would not be recieved without this middleware (which is meant for uploadings pictures). This is a temp bandaid fix. Nothing gets uploaded"
  ),
  projectController.login
);
//auth version for the main user
router.get("/profile", authMiddleware, projectController.profile);
//to view someone elses profile
router.get("/otherprofile", projectController.getOtherProfile);
router.post("/logout", authMiddleware, projectController.logout);

module.exports = router;
