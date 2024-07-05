const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
router.get("/list", authMiddleware, bookController.getAll);
router.get("/manage", authMiddleware, adminMiddleware, bookController.manage);
router.get("/:id", authMiddleware, bookController.getById);

module.exports = router;
