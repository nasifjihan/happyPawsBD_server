import { createValidationError } from "../../validation/common.js";

const allowedUrgencies = ["low", "medium", "high", "critical"];

export const validateRescueAlertPayload = (payload) => {
  const reporterName = String(payload?.reporterName || "").trim();
  const contactPhone = String(payload?.contactPhone || "").trim();
  const contactEmail = String(payload?.contactEmail || "").trim();
  const animalType = String(payload?.animalType || "").trim();
  const location = String(payload?.location || "").trim();
  const landmark = String(payload?.landmark || "").trim();
  const urgency = String(payload?.urgency || "medium").trim();
  const description = String(payload?.description || "").trim();
  const photo = String(payload?.photo || "").trim();

  if (!reporterName) {
    throw createValidationError("Reporter name is required.");
  }

  if (!contactPhone) {
    throw createValidationError("Contact phone is required.");
  }

  if (!animalType) {
    throw createValidationError("Animal type is required.");
  }

  if (!location) {
    throw createValidationError("Location is required.");
  }

  if (!description) {
    throw createValidationError("Description is required.");
  }

  if (!allowedUrgencies.includes(urgency)) {
    throw createValidationError("Invalid urgency value.");
  }

  return {
    reporterName,
    contactPhone,
    contactEmail: contactEmail || undefined,
    animalType,
    location,
    landmark: landmark || undefined,
    urgency,
    description,
    photo: photo || undefined,
  };
};

