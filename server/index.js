const PORT = 3000;
const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const router = require("./router");
const serve = require("koa-static");

app.use(serve("."));
app.use(bodyParser());
app.use(cors());
app.use(router.routes());

app.listen(PORT, () => {
  console.log(`app listening at http//localhost:${PORT}`);
});
