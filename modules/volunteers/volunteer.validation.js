import {
  assertRequiredFields,
  assertValidEmail,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

export const validateVolunteerApplicationPayload = (payload) => {
  const normalizedPayload = {
    fullName: normalizeString(payload.fullName),
    contactEmail: normalizeEmail(payload.contactEmail),
    contactPhone: normalizeString(payload.contactPhone),
    city: normalizeString(payload.city),
    preferredRole: normalizeString(payload.preferredRole),
    availability: normalizeString(payload.availability),
    experience: normalizeString(payload.experience),
    motivation: normalizeString(payload.motivation),
  };

  assertRequiredFields(normalizedPayload, [
    "fullName",
    "contactEmail",
    "contactPhone",
    "city",
    "preferredRole",
    "availability",
    "motivation",
  ]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  return normalizedPayload;
};
