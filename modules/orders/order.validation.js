import {
  assertAllowedValues,
  assertRequiredFields,
  assertValidEmail,
  createValidationError,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";
import { calculateOrderTotal } from "./order.service.js";

const allowedPaymentMethods = ["online_payment", "cash_on_delivery"];

const normalizeOrderItem = (item) => ({
  id: normalizeString(item?.id),
  name: normalizeString(item?.name),
  price: Number(item?.price),
  quantity: Number(item?.quantity),
});

export const validateOrderPayload = (payload) => {
  const deliveryInfo = {
    name: normalizeString(payload?.deliveryInfo?.name),
    email: normalizeEmail(payload?.deliveryInfo?.email),
    phone: normalizeString(payload?.deliveryInfo?.phone),
    city: normalizeString(payload?.deliveryInfo?.city),
    state: normalizeString(payload?.deliveryInfo?.state),
    zip: normalizeString(payload?.deliveryInfo?.zip),
    address: normalizeString(payload?.deliveryInfo?.address),
  };

  const orderSummary = {
    items: Array.isArray(payload?.orderSummary?.items)
      ? payload.orderSummary.items.map(normalizeOrderItem)
      : [],
    submittedTotal: Number(payload?.orderSummary?.total),
  };

  const paymentMethod = normalizeString(payload?.paymentMethod);

  assertRequiredFields(deliveryInfo, ["name", "phone", "email", "address"]);
  assertValidEmail(deliveryInfo.email, "delivery email");

  if (!Array.isArray(orderSummary.items) || orderSummary.items.length === 0) {
    throw createValidationError("Order items are required.");
  }

  orderSummary.items.forEach((item) => {
    if (Number.isNaN(item.price) || item.price <= 0) {
      throw createValidationError(
        `Invalid price for item: ${item.id || item.name || "unknown"}`
      );
    }

    if (Number.isNaN(item.quantity) || item.quantity <= 0) {
      throw createValidationError(
        `Invalid quantity for item: ${item.id || item.name || "unknown"}`
      );
    }
  });

  if (
    Number.isNaN(orderSummary.submittedTotal) ||
    orderSummary.submittedTotal < 0
  ) {
    throw createValidationError("Order total must be a valid number.");
  }

  const computedTotal = calculateOrderTotal(orderSummary.items);

  if (Math.abs(orderSummary.submittedTotal - computedTotal) > 0.01) {
    throw createValidationError("Order total does not match the provided items.");
  }

  orderSummary.total = computedTotal;
  delete orderSummary.submittedTotal;

  assertAllowedValues(
    paymentMethod,
    allowedPaymentMethods,
    "Payment method"
  );

  return {
    deliveryInfo,
    orderSummary,
    paymentMethod,
  };
};
