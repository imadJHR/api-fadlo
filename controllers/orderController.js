import Order from "../models/orderModel.js";

// ---------------------- CREATE ORDER ----------------------
export const createOrder = async (req, res) => {
  try {
    const {
      car,
      fullName,
      email,
      phone,
      pickupDate,
      returnDate,
      totalDays,
      totalPrice,
    } = req.body;

    // Validation
    if (!car || !pickupDate || !returnDate || !fullName || !email)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });

    const newOrder = await Order.create({
      car,
      fullName,
      email,
      phone,
      pickupDate,
      returnDate,
      totalDays,
      totalPrice,
      status: "pending",
    });

    return res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("❌ Create order error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------------- GET ALL ORDERS ----------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("car").sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Get all orders error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------------- GET ORDERS BY EMAIL ----------------------
export const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ email }).populate("car");

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Get orders by email error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------------- UPDATE ORDER STATUS ----------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "confirmed", "cancelled"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    return res.json({
      success: true,
      message: "Order updated",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("❌ Update order error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------------- DELETE ORDER ----------------------
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const removed = await Order.findByIdAndDelete(id);

    if (!removed)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    return res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (err) {
    console.error("❌ Delete order error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
