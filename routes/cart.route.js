const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/list", authMiddleware, cartController.getAll);
router.post("/add", authMiddleware, cartController.addHandler);

module.exports = router;
