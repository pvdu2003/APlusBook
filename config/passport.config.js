const dotenv = require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-strategy").Strategy;
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
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            let newUser = new User({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
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
