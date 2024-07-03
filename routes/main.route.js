const userRouter = require("./user.route");
const authRouter = require("./auth.route");
const homeRouter = require("./home.route");
const categoryRouter = require("./category.route");

function route(app) {
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/category", categoryRouter);
  app.use("/", homeRouter);
}

module.exports = route;
