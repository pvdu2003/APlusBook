const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

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
router.get("/manage", userController.manage);
// router.post("/update-role", userController.updateRole);
// router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;
