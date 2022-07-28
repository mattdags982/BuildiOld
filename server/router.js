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
//add bid to a specific project
router.post("/bid", projectController.addBid);
//return all prjects
router.get("/projects", projectController.returnProjects);
//return specific project for details page
router.get("/oneProject", projectController.returnOneProject);

//auth routes
router.post("/register", projectController.createUser);
router.post("/login", projectController.login);
router.get("/profile", authMiddleware, projectController.profile);
router.post("/logout", authMiddleware, projectController.logout);

module.exports = router;
