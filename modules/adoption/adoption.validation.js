import {
  assertRequiredFields,
  assertValidEmail,
  createValidationError,
  isBlank,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

export const validateAdoptionPayload = (payload, animalCode) => {
  const normalizedPayload = {
    animalType: normalizeString(payload.animalType),
    adopterName: normalizeString(payload.adopterName),
    contactEmail: normalizeEmail(payload.contactEmail),
    contactPhone: normalizeString(payload.contactPhone),
    address: normalizeString(payload.address),
    experience: normalizeString(payload.experience),
    animalCode: normalizeString(animalCode),
  };

  assertRequiredFields(normalizedPayload, [
    "animalType",
    "adopterName",
    "contactPhone",
    "address",
  ]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  if (isBlank(normalizedPayload.animalCode)) {
    throw createValidationError("Animal code is required.");
  }

  return normalizedPayload;
};
