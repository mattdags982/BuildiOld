const PORT = 3000;
const SECRET = process.env.SECRET || "sUpEr SeCrEt";
//REMOVE
// const Koa = require("koa");
//NEW
const express = require("express");
//CAHNGED
const app = new express();
//REMOVE
// const bodyParser = require("koa-bodyparser");
//REMOVE
// const cors = require("@koa/cors");
const cors = require("cors");
const router = require("./router");
//REMOVE
// const serve = require("koa-static");
// const session = require("koa-session");
//needed for session to work
// const corsConfig = {
//   origin: "http://localhost:3000",
//   credentials: true,
// };
// app.keys = [SECRET];
// const CONFIG = {
//   key: "koa.sess" /** (string) cookie key (default is koa.sess) */,
//   /** (number || 'session') maxAge in ms (default is 1 days) */
//   /** 'session' will result in a cookie that expires when session/browser is closed */
//   /** Warning: If a session cookie is stolen, this cookie will never expire */
//   maxAge: 86400000,
//   autoCommit: true /** (boolean) automatically commit headers (default true) */,
//   overwrite: true /** (boolean) can overwrite or not (default true) */,
//   httpOnly: false /** (boolean) httpOnly or not (default true) */,
//   signed: true /** (boolean) signed or not (default true) */,
//   rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
//   renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
//   secure: false /** (boolean) secure cookie*/,
//   sameSite: true /** (string) session cookie sameSite options (default null, don't set it) */,
// };
//note, if pics stop working you had cors config below bodyparser
app.use(cors({}));
//POTENTIAL ISSUE HERE
app.use("/uploads", express.static("uploads"));
//CAHNGE
// app.use(bodyParser());
app.use(express.json());

// app.use(session(CONFIG, app));
app.use(router);

app.listen(PORT, () => {
  console.log(`app listening at http//localhost:${PORT}`);
});
