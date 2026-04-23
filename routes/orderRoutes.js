const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, admin, getOrders)
  .post(protect, admin, createOrder);

router
  .route("/:id")
  .get(protect, admin, getOrder)
  .put(protect, admin, updateOrderStatus);

module.exports = router;
