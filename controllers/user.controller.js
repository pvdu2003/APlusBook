const bcrypt = require("bcrypt");
const User = require("../models/user.schema");

class userController {
  // [GET] /user/profile
  async myProfile(req, res, next) {
    try {
      let user = req.cookies.user;
      let usr = await User.findById(user._id);
      res.render("pages/user/profile", { usr });
    } catch (error) {
      next(error);
    }
  }
  // [GET] /user/update
  async update(req, res, next) {
    try {
      let user = req.cookies.user;
      let usr = await User.findById(user._id);
      res.render("pages/user/updateProfile", { usr });
    } catch (error) {
      next(error);
    }
  }
  // [PATCH] /user/update
  async updateHandler(req, res, next) {
    try {
      let err = {};
      let { email, address, dob, phone_num } = req.body;
      let user = req.cookies.user;
      const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
      if (phone_num !== "" && !phoneRegex.test(phone_num)) {
        err.phone_num = "Please enter a valid phone number!";
      }
      if (Object.keys(err).length > 0) {
        let usr = await User.findById(user._id);
        return res.render("pages/user/updateProfile", { usr, err });
      }
      await User.findByIdAndUpdate(user._id, {
        $set: {
          email,
          address,
          dob,
          phone_num,
        },
      });
      res.redirect("/user/profile");
    } catch (err) {
      next(err);
    }
  }
  // [GET] /user/change-password
  changePwd(req, res, next) {
    res.render("pages/user/changePwd");
  }
  // [PATCH] /user/change-password
  async changePwdHandler(req, res, next) {
    try {
      let err = {};
      let { password, new_password, confirm_pwd } = req.body;
      let user = req.cookies.user;
      let usr = await User.findById(user._id);
      let match = await bcrypt.compare(password, usr.password);
      if (!match) {
        err.password = "This password is not correct!";
      }
      if (new_password.length < 6) {
        err.new_password = "Password must be more than 6 characters!";
      }
      if (new_password !== confirm_pwd) {
        err.confirm_pwd = "Passwords do not match!";
      }

      if (Object.keys(err).length > 0) {
        return res.render("pages/user/changePwd", { err });
      }
      const hashedPwd = await bcrypt.hash(new_password, 10);
      const newUser = await User.findByIdAndUpdate(user._id, {
        $set: { password: hashedPwd },
      });
      res.clearCookie("user");
      res.cookie("user", newUser, { maxAge: 1800000 });
      res.redirect("/user/profile");
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new userController();
