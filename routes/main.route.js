const userRouter = require("./user.route");
const authRouter = require("./auth.route");
const homeRouter = require("./home.route");
const bookRouter = require("./book.route");
const cartRouter = require("./cart.route");
const orderRouter = require("./order.route");
const categoryRouter = require("./category.route");

function route(app) {
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/category", categoryRouter);
  app.use("/book", bookRouter);
  app.use("/order", orderRouter);
  app.use("/cart", cartRouter);
  app.use("/", homeRouter);
}

module.exports = route;
