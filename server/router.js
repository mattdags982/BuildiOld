const Router = require("@koa/router");
const router = new Router();
const projectController = require("./controller/project.controller");
//,ulter is for incoming form data
const multer = require("@koa/multer");
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

router.post(
  "/create",
  upload.single("projectImage"),
  projectController.postProject
);

router.get("/projects", projectController.returnProjects);

router.get("/oneProject", projectController.returnOneProject);

module.exports = router;
