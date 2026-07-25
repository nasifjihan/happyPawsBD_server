import {
  assertAllowedValues,
  assertRequiredFields,
  assertValidEmail,
  createValidationError,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

const normalizePaymentItem = (item) => ({
  id: normalizeString(item?.id),
  name: normalizeString(item?.name),
  price: Number(item?.price),
  quantity: Number(item?.quantity),
});

const allowedPaymentMethods = ["online_payment", "cash_on_delivery"];

export const validatePaymentPayload = (payload) => {
  const items = Array.isArray(payload?.items)
    ? payload.items.map(normalizePaymentItem)
    : [];
  const deliveryInfo = {
    name: normalizeString(payload?.deliveryInfo?.name),
    email: normalizeEmail(payload?.deliveryInfo?.email),
    phone: normalizeString(payload?.deliveryInfo?.phone),
    city: normalizeString(payload?.deliveryInfo?.city),
    state: normalizeString(payload?.deliveryInfo?.state),
    zip: normalizeString(payload?.deliveryInfo?.zip),
    address: normalizeString(payload?.deliveryInfo?.address),
  };
  const paymentMethod = normalizeString(payload?.paymentMethod);

  if (items.length === 0) {
    throw createValidationError("At least one payment item is required.");
  }

  assertRequiredFields(deliveryInfo, ["name", "phone", "email", "address"]);
  assertValidEmail(deliveryInfo.email, "delivery email");
  assertAllowedValues(
    paymentMethod,
    allowedPaymentMethods,
    "Payment method"
  );

  items.forEach((item) => {
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

  return {
    items,
    deliveryInfo,
    paymentMethod,
  };
};
