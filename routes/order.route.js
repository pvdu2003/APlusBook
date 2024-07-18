const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

router.get("/list", authMiddleware, orderController.getAll);
router.get("/manage", authMiddleware, adminMiddleware, orderController.manage);
router.patch(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  orderController.updateHandler
);
router.post("/checkout", authMiddleware, orderController.checkout);
router.delete("/delete/:id", authMiddleware, orderController.deleteHandler);
router.get("/:id", authMiddleware, adminMiddleware, orderController.detail);

module.exports = router;
