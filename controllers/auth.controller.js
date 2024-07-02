const bcrypt = require("bcrypt");
const User = require("../models/user.schema");

class authController {
  // [GET] /auth/login
  login(req, res, next) {
    res.render("pages/auth/login");
  }
  // [POST] /auth/login
  async loginHandler(req, res, next) {
    const { username, password } = req.body;
    let err = {};
    if (username === undefined || username === "") {
      err.username = "Please enter your username";
    }
    if (!password) {
      err.password = "Please enter your password";
    }
    if (Object.keys(err).length > 0) {
      return res.render("pages/auth/login", { err });
    }
    User.findOne({ username })
      .then((existingUser) => {
        if (!existingUser) {
          err.username = "This username is not existing!";
          return res.render("pages/auth/login", { err });
        } else {
          bcrypt
            .compare(password, existingUser.password)
            .then((match) => {
              if (match) {
                res.cookie("user", existingUser, { maxAge: 1800000 });
                res.redirect("/");
              } else {
                err.password = "This password is not correct!";
                res.render("pages/auth/login", { err });
              }
            })
            .catch(next);
        }
      })
      .catch(next);
  }
  register(req, res, next) {
    res.render("pages/auth/register");
  }
  registerHandler(req, res, next) {
    const { username, password, confirmPw, phoneNum, email, name } = req.body;
    let err = {};
    if (username === undefined || username === "") {
      err.username = "Please enter your username";
    }
    if (name === undefined || name === "") {
      err.name = "Please enter your full name";
    }
    if (password === undefined || password === "") {
      err.password = "Please enter your password";
    }
    if (confirmPw === undefined || confirmPw === "") {
      err.confirmPw = "Please enter your password again";
    }
    if (phoneNum === undefined || phoneNum === "") {
      err.phoneNum = "Please enter your phone number";
    }
    if (email === undefined || email === "") {
      err.email = "Please enter your email address";
    }
    if (Object.keys(err).length === 0) {
      User.findOne({ username })
        .then((existingUser) => {
          if (existingUser) {
            err.username = "This username has already existed!";
          }
          if (password.length <= 6) {
            err.password = "This password is too short!";
          }
          if (password !== confirmPw) {
            err.confirmPw =
              "This password is not match with the previous password above!";
          }
          const phoneRegex =
            /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
          if (!phoneRegex.test(phoneNum)) {
            err.phoneNum = "Please enter a valid phone number!";
          }
          if (Object.keys(err).length > 0) {
            return res.render("pages/auth/register", { err });
          }
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const newUser = new User({
                username: username,
                name: name,
                password: hashedPassword,
                phone_num: phoneNum,
                email: email,
              });
              return newUser.save();
            })
            .then(() => {
              return res.redirect("/auth/login");
            })
            .catch(next);
        })
        .catch(next);
    } else {
      return res.status(400).render("pages/auth/register", { err });
    }
  }
  // [GET] /auth/logout
  logout(req, res, next) {
    res.clearCookie("user");
    res.redirect("/");
  }
}
module.exports = new authController();
