const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// router.get("/profile/:id", userController.userProfile);
router.get("/profile", authMiddleware, userController.myProfile);
router.get("/update", authMiddleware, userController.update);
router.patch("/update", authMiddleware, userController.updateHandler);
router.get("/change-password", authMiddleware, userController.changePwd);
router.patch(
  "/change-password",
  authMiddleware,
  userController.changePwdHandler
);
// router.get("/showUser", userController.showUser);
// router.post("/update-role", userController.updateRole);
// router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;
