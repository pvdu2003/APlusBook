"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const dotenv = require("dotenv").config();
const db = require("./config/db");
const route = require("./routes/main.route");
const loadCategories = require("./middlewares/categories.middleware");
const passportSetup = require("./config/passport.config");
db.connect();
const port = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
// set up session cookies
app.use(
  session({
    maxAge: 12 * 60 * 60 * 1000,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(loadCategories);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
route(app);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
