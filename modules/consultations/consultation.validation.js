import {
  assertAllowedValues,
  assertRequiredFields,
  assertValidEmail,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

const allowedConsultationModes = ["video", "phone"];
const allowedHouseCallUrgencies = ["low", "medium", "high"];

export const validateOnlineConsultationPayload = (payload) => {
  const normalizedPayload = {
    fullName: normalizeString(payload.fullName),
    contactEmail: normalizeEmail(payload.contactEmail),
    contactPhone: normalizeString(payload.contactPhone),
    petType: normalizeString(payload.petType),
    petName: normalizeString(payload.petName),
    petAge: normalizeString(payload.petAge),
    consultationMode: normalizeString(payload.consultationMode) || "video",
    preferredDoctor: normalizeString(payload.preferredDoctor),
    preferredSlot: normalizeString(payload.preferredSlot),
    concern: normalizeString(payload.concern),
  };

  assertRequiredFields(normalizedPayload, [
    "fullName",
    "contactPhone",
    "petType",
    "concern",
  ]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");
  assertAllowedValues(
    normalizedPayload.consultationMode,
    allowedConsultationModes,
    "consultation mode"
  );

  return normalizedPayload;
};

export const validateInPersonConsultationPayload = (payload) => {
  const normalizedPayload = {
    fullName: normalizeString(payload.fullName),
    contactEmail: normalizeEmail(payload.contactEmail),
    contactPhone: normalizeString(payload.contactPhone),
    petType: normalizeString(payload.petType),
    petName: normalizeString(payload.petName),
    petAge: normalizeString(payload.petAge),
    city: normalizeString(payload.city),
    address: normalizeString(payload.address),
    preferredDate: normalizeString(payload.preferredDate),
    preferredTime: normalizeString(payload.preferredTime),
    concern: normalizeString(payload.concern),
  };

  assertRequiredFields(normalizedPayload, [
    "fullName",
    "contactPhone",
    "petType",
    "city",
    "address",
    "concern",
  ]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  return normalizedPayload;
};

export const validateHouseCallPayload = (payload) => {
  const normalizedPayload = {
    fullName: normalizeString(payload.fullName),
    contactEmail: normalizeEmail(payload.contactEmail),
    contactPhone: normalizeString(payload.contactPhone),
    petType: normalizeString(payload.petType),
    petName: normalizeString(payload.petName),
    petAge: normalizeString(payload.petAge),
    city: normalizeString(payload.city),
    address: normalizeString(payload.address),
    preferredDate: normalizeString(payload.preferredDate),
    preferredTime: normalizeString(payload.preferredTime),
    urgency: normalizeString(payload.urgency) || "medium",
    concern: normalizeString(payload.concern),
  };

  assertRequiredFields(normalizedPayload, [
    "fullName",
    "contactPhone",
    "petType",
    "city",
    "address",
    "concern",
  ]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");
  assertAllowedValues(
    normalizedPayload.urgency,
    allowedHouseCallUrgencies,
    "urgency"
  );

  return normalizedPayload;
};
