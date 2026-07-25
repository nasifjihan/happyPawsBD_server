import { Orders } from "../../model/Schema.js";

export const createOrderRecord = async (payload) => {
  const order = new Orders(payload);
  return order.save();
};

export const calculateOrderTotal = (items) =>
  items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

export const updateOrderRecord = async (orderId, updates) =>
  Orders.findByIdAndUpdate(orderId, updates, {
    new: true,
  });

export const findOrderByStripeCheckoutSessionId = async (sessionId) =>
  Orders.findOne({ stripeCheckoutSessionId: sessionId });
