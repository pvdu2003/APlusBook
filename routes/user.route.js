const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const userTrashMiddleware = require("../middlewares/userTrash.middleware");

router.use(userTrashMiddleware);
router.get(
  "/profile/:id",
  authMiddleware,
  adminMiddleware,
  userController.userProfile
);
router.get("/profile", authMiddleware, userController.myProfile);
router.get("/update", authMiddleware, userController.update);
router.patch("/update", authMiddleware, userController.updateHandler);
router.get("/change-password", authMiddleware, userController.changePwd);
router.patch(
  "/change-password",
  authMiddleware,
  userController.changePwdHandler
);
router.get("/manage", authMiddleware, adminMiddleware, userController.manage);
router.get(
  "/trash",
  authMiddleware,
  adminMiddleware,
  userController.renderTrash
);
// router.post("/update-role", userController.updateRole);
router.delete(
  "/delete/:id/force",
  authMiddleware,
  adminMiddleware,
  userController.forceDelete
);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteHandler
);
router.patch(
  "/restore/:id",
  authMiddleware,
  adminMiddleware,
  userController.restore
);
module.exports = router;
