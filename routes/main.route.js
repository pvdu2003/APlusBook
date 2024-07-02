const userRouter = require("./user.route");
const authRouter = require("./auth.route");
const homeRouter = require("./home.route");
function route(app) {
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/", homeRouter);
}

module.exports = route;
