const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const trashMiddleware = require("../middlewares/trash.middleware");

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
router.use(trashMiddleware);

router.get("/list", authMiddleware, bookController.getAll);
router.get("/manage", authMiddleware, adminMiddleware, bookController.manage);
router.get("/add", authMiddleware, adminMiddleware, bookController.add);
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  bookController.addHandler
);
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
router.get(
  "/trash",
  authMiddleware,
  adminMiddleware,
  bookController.renderTrash
);
router.patch(
  "/restore/:id",
  authMiddleware,
  adminMiddleware,
  bookController.restore
);
router.delete(
  "/delete/:id/force",
  authMiddleware,
  adminMiddleware,
  bookController.forceDelete
);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  bookController.deleteHandler
);
router.get("/:id", authMiddleware, bookController.getById);

module.exports = router;
