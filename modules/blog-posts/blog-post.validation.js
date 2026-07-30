import { assertAllowedValues, createValidationError } from "../../validation/common.js";

const allowedStatuses = ["draft", "published", "archived"];

export const normalizePositiveInteger = (value, fallback) => {
  const normalizedValue = Number.parseInt(value, 10);

  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
};

export const getPagination = (query) => ({
  page: normalizePositiveInteger(query.page, 1),
  limit: Math.min(normalizePositiveInteger(query.limit, 9), 50),
});

export const normalizeBlogStatus = (value, fallback = "published") => {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return fallback;
  }

  assertAllowedValues(normalized, allowedStatuses, "status");
  return normalized;
};

export const normalizeBlogId = (value) => {
  const id = Number.parseInt(value, 10);
  if (!Number.isFinite(id)) {
    throw createValidationError("Valid blog post id is required.");
  }
  return id;
};

