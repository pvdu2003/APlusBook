const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
router.get("/list", bookController.getAll);
router.get("/:id", bookController.getById);

module.exports = router;
