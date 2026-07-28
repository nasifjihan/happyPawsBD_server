import { Orders } from "../../model/Schema.js";
import crypto from "node:crypto";

const createPublicToken = () => crypto.randomBytes(16).toString("hex");

export const createOrderRecord = async (payload) => {
  const basePayload = payload || {};

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const order = new Orders({
        ...basePayload,
        publicToken: basePayload.publicToken || createPublicToken(),
      });
      return await order.save();
    } catch (error) {
      const isDuplicateToken =
        error?.code === 11000 && error?.keyPattern?.publicToken;

      if (!isDuplicateToken || attempt === 2) {
        throw error;
      }
    }
  }

  throw new Error("Could not generate a unique order token.");
};

export const calculateOrderTotal = (items) =>
  Number(
    items
      .reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 0),
        0
      )
      .toFixed(2)
  );

export const updateOrderRecord = async (orderId, updates) =>
  Orders.findByIdAndUpdate(orderId, updates, {
    new: true,
  });

export const findOrderByStripeCheckoutSessionId = async (sessionId) =>
  Orders.findOne({ stripeCheckoutSessionId: sessionId });

export const findOrderByPublicToken = async (publicToken) =>
  Orders.findOne({ publicToken }).lean();
