const User = require("../models/user.schema");

class userController {
  async myProfile(req, res, next) {
    try {
      let user = req.cookies.user;
      // Check if req.user is defined
      if (!user) {
        return res.status(401).redirect("/auth/login");
      }
      console.log(user);
      res.render("pages/user/profile", { user });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new userController();
