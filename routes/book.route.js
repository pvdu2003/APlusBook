const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.get("/list", authMiddleware, bookController.getAll);
router.get("/:id", authMiddleware, bookController.getById);

module.exports = router;
