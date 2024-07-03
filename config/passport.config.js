const dotenv = require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.schema");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            const newUser = new User({
              username: profile.displayName.replace(/\s/g, "").toLowerCase(),
              name: profile.displayName,
              email: profile.emails[0].value,
              role: "user",
            });
            newUser
              .save()
              .then((user) => {
                done(null, user);
              })
              .catch((err) => {
                done(err, null);
              });
          }
        })
        .catch((err) => {
          done(err, null);
        });
    }
  )
);
