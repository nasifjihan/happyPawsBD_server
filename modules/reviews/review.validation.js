import {
  assertRequiredFields,
  assertValidEmail,
  createValidationError,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

export const validateReviewPayload = (payload) => {
  const normalizedPayload = {
    fullName: normalizeString(payload.fullName),
    contactEmail: normalizeEmail(payload.contactEmail),
    rating:
      typeof payload.rating === "number"
        ? payload.rating
        : Number.parseInt(payload.rating, 10),
    title: normalizeString(payload.title),
    message: normalizeString(payload.message),
  };

  assertRequiredFields(normalizedPayload, ["fullName", "rating", "title", "message"]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  if (!Number.isFinite(normalizedPayload.rating)) {
    throw createValidationError("Rating must be a number between 1 and 5.");
  }

  if (normalizedPayload.rating < 1 || normalizedPayload.rating > 5) {
    throw createValidationError("Rating must be a number between 1 and 5.");
  }

  return normalizedPayload;
};

