import test from "node:test";
import assert from "node:assert/strict";

import { validateLostPetPayload } from "../modules/lost-found/lost-found.validation.js";
import { validateOrderPayload } from "../modules/orders/order.validation.js";
import { validatePaymentPayload } from "../modules/payments/payment.validation.js";

test("validateLostPetPayload trims strings and normalizes email", () => {
  const result = validateLostPetPayload({
    petName: "  Bruno  ",
    animalType: " Dog ",
    colors: "Brown",
    ownerName: " Nasif ",
    contactPhone: " 01700000000 ",
    contactEmail: " TEST@EXAMPLE.COM ",
    lastSeenLocation: " Dhaka ",
    lostDate: "2026-07-25",
    description: " Friendly pet ",
    petPicture: "https://example.com/dog.jpg",
  });

  assert.equal(result.petName, "Bruno");
  assert.equal(result.contactEmail, "test@example.com");
  assert.equal(result.contactPhone, "01700000000");
});

test("validateOrderPayload accepts current frontend checkout shape", () => {
  const result = validateOrderPayload({
    deliveryInfo: {
      name: " Nasif ",
      email: " TEST@EXAMPLE.COM ",
      phone: "01700000000",
      city: "Dhaka",
      state: "Dhaka",
      zip: "1207",
      address: "Banani",
    },
    orderSummary: {
      items: [{ id: "P001", name: "Cat Food", price: 250, quantity: 2 }],
      total: 500,
    },
    paymentMethod: "cash_on_delivery",
  });

  assert.equal(result.deliveryInfo.email, "test@example.com");
  assert.equal(result.paymentMethod, "cash_on_delivery");
  assert.equal(result.orderSummary.total, 500);
});

test("validateOrderPayload rejects mismatched totals", () => {
  assert.throws(
    () =>
      validateOrderPayload({
        deliveryInfo: {
          name: "Nasif",
          email: "test@example.com",
          phone: "01700000000",
          address: "Banani",
        },
        orderSummary: {
          items: [{ id: "P001", name: "Cat Food", price: 250, quantity: 2 }],
          total: 10,
        },
        paymentMethod: "cash_on_delivery",
      }),
    /Order total does not match/
  );
});

test("validatePaymentPayload rejects unsupported payment methods", () => {
  assert.throws(
    () =>
      validatePaymentPayload({
        items: [{ id: "P001", name: "Cat Food", price: 250, quantity: 1 }],
        deliveryInfo: {
          name: "Nasif",
          email: "test@example.com",
          phone: "01700000000",
          address: "Banani",
        },
        paymentMethod: "bank_transfer",
      }),
    /Payment method must be one of/
  );
});
