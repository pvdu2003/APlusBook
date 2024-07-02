"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const dotenv = require("dotenv").config();
const db = require("./config/db");
const route = require("./routes/main.route");
const loadCategories = require("./middlewares/categories.middleware");

db.connect();
const port = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(loadCategories);

route(app);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
