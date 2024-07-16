const express = require("express");
const router = express.Router();
const AnnouncementController = require("../controllers/announcement.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const announceMiddleware = require("../middlewares/announceTrash.middleware");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/announcements"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
router.use(announceMiddleware);
router.get("/list", AnnouncementController.getAll);
router.get("/add", authMiddleware, adminMiddleware, AnnouncementController.add);
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  upload.array("topicFile", 10),
  AnnouncementController.uploadFile
);
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("topicFile", 10),
  AnnouncementController.updateAnnouncement
);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  AnnouncementController.deleteAnnouncement
);
router.get("/:id", AnnouncementController.getById);
module.exports = router;
