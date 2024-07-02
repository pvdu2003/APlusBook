const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/login", authController.login);
router.post("/login", authController.loginHandler);
router.get("/register", authController.register);
router.post("/register", authController.registerHandler);
module.exports = router;
