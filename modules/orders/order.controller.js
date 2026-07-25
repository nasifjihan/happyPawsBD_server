import { validateOrderPayload } from "./order.validation.js";
import { createOrderRecord } from "./order.service.js";

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
