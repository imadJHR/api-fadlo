import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByEmail,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Create order
router.post("/", createOrder);

// Admin: Get all orders
router.get("/", getAllOrders);

// Get all orders made by a client (via email)
router.get("/user/:email", getOrdersByEmail);

// Update status (pending/confirmed/cancelled)
router.put("/:id", updateOrderStatus);

// Delete order
router.delete("/:id", deleteOrder);

export default router;
