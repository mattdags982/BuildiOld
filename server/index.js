//Initial Vars
const PORT = 3000;
const SECRET = process.env.SECRET || "sUpEr SeCrEt";
//Require
const express = require("express");
const cors = require("cors");
const router = require("./router");
const session = require("express-session");
const bodyParser = require("body-parser");
//Set Up
const app = new express();
const corsConfig = {
  // origin: "http://localhost:3001",
  origin: "http://192.168.1.144:3001",
  credentials: true,
};
//Middleware
//corsConfig needed for session
app.use(cors(corsConfig));

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//session set up
app.use(
  session({
    // the store property, if not specified, defaults to the in-memory store
    name: "sid",
    saveUninitialized: false,
    resave: false,
    secret: "secret",
    cookie: {
      maxAge: 1000 * 60 * 60, // 1hr
      sameSite: true,
      httpOnly: false,
      // we would want to set secure=true in a production environment
      secure: false,
    },
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`app listening at http//localhost:${PORT}`);
});
