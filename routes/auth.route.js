const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/login", authController.loginHandler);
router.get("/register", authController.register);
router.post("/register", authController.registerHandler);
// auth with google+
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user);
  res.cookie("user", req.user, {
    maxAge: 3600000,
  });
  res.redirect("/");
});
module.exports = router;
