const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
router.get("/:id", categoryController.getById);

module.exports = router;
