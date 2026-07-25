import test from "node:test";
import assert from "node:assert/strict";

import { calculateOrderTotal } from "../modules/orders/order.service.js";
import {
  getConfiguredOrigins,
  isAllowedOrigin,
  isLocalDevOrigin,
  resolveClientOrigin,
} from "../utils/origin.js";

test("calculateOrderTotal sums numeric item totals", () => {
  const total = calculateOrderTotal([
    { price: 100, quantity: 2 },
    { price: "50", quantity: "3" },
  ]);

  assert.equal(total, 350);
});

test("origin utilities allow local development origins", () => {
  assert.equal(isLocalDevOrigin("http://localhost:5173"), true);
  assert.equal(isAllowedOrigin("http://127.0.0.1:4173"), true);
});

test("resolveClientOrigin falls back to configured client url", () => {
  process.env.CLIENT_URL = "http://localhost:5173";

  assert.equal(
    resolveClientOrigin("https://malicious.example.com"),
    "http://localhost:5173"
  );

  const configuredOrigins = getConfiguredOrigins();
  assert.ok(configuredOrigins.includes("http://localhost:5173"));
});
