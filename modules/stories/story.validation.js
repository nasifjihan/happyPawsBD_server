import {
  assertRequiredFields,
  assertValidEmail,
  createValidationError,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

const allowedCategories = ["community", "remembrance", "success"];

export const validateStorySubmissionPayload = (payload) => {
  const normalizedPayload = {
    category: normalizeString(payload.category) || "community",
    title: normalizeString(payload.title),
    excerpt: normalizeString(payload.excerpt),
    story: normalizeString(payload.story),
    authorName: normalizeString(payload.authorName),
    contactEmail: normalizeEmail(payload.contactEmail),
    contactPhone: normalizeString(payload.contactPhone),
    petName: normalizeString(payload.petName),
    location: normalizeString(payload.location),
    image: normalizeString(payload.image),
  };

  if (!allowedCategories.includes(normalizedPayload.category)) {
    throw createValidationError("Invalid story category.");
  }

  assertRequiredFields(normalizedPayload, ["title", "story", "authorName"]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  if (normalizedPayload.excerpt && normalizedPayload.excerpt.length > 240) {
    throw createValidationError("Short summary must be 240 characters or less.");
  }

  return normalizedPayload;
};

