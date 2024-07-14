const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/list", authMiddleware, orderController.getAll);
router.post("/checkout", authMiddleware, orderController.checkout);
router.delete("/delete/:id", authMiddleware, orderController.deleteHandler);

module.exports = router;
