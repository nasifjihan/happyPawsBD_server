import {
  assertRequiredFields,
  assertValidEmail,
  createValidationError,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

export const validateProgramEnrollmentPayload = (payload, programId) => {
  const normalizedPayload = {
    name: normalizeString(payload.name),
    contactEmail: normalizeEmail(payload.contactEmail),
    contactPhone: normalizeString(payload.contactPhone),
    address: normalizeString(payload.address),
    programId: Number(programId),
  };

  assertRequiredFields(normalizedPayload, ["name", "contactPhone", "address"]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  if (Number.isNaN(normalizedPayload.programId)) {
    throw createValidationError("Program id must be a valid number.");
  }

  return normalizedPayload;
};
