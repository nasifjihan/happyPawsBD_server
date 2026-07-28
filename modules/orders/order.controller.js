import { validateOrderPayload } from "./order.validation.js";
import { createOrderRecord, findOrderByPublicToken } from "./order.service.js";

const serializePublicOrder = (order) => {
  if (!order) {
    return null;
  }

  return {
    _id: order._id,
    publicToken: order.publicToken,
    deliveryInfo: {
      name: order.deliveryInfo?.name,
      city: order.deliveryInfo?.city,
      state: order.deliveryInfo?.state,
      zip: order.deliveryInfo?.zip,
      address: order.deliveryInfo?.address,
    },
    orderSummary: order.orderSummary,
    paymentMethod: order.paymentMethod,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

export const createOrder = async (req, res, next) => {
  try {
    const orderPayload = validateOrderPayload(req.body);
    const savedOrder = await createOrderRecord(orderPayload);

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByPublicToken = async (req, res, next) => {
  try {
    const token = String(req.params.token || "").trim();

    if (!token) {
      res.status(400).json({ message: "Order token is required." });
      return;
    }

    const order = await findOrderByPublicToken(token);

    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json({ order: serializePublicOrder(order) });
  } catch (error) {
    next(error);
  }
};
