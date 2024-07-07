const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/list", authMiddleware, bookController.getAll);
router.get("/manage", authMiddleware, adminMiddleware, bookController.manage);
router.get(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  bookController.update
);
router.patch(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  bookController.updateHandler
);
router.get("/:id", authMiddleware, bookController.getById);

module.exports = router;
