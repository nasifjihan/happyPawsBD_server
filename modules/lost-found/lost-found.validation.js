import {
  assertRequiredFields,
  assertValidEmail,
  normalizeEmail,
  normalizeString,
} from "../../validation/common.js";

const normalizeLostFoundPayload = (payload) => ({
  petName: normalizeString(payload.petName),
  animalType: normalizeString(payload.animalType),
  breed: normalizeString(payload.breed),
  colors: normalizeString(payload.colors),
  gender: normalizeString(payload.gender),
  ownerName: normalizeString(payload.ownerName),
  founderName: normalizeString(payload.founderName),
  contactPhone: normalizeString(payload.contactPhone),
  contactEmail: normalizeEmail(payload.contactEmail),
  lastSeenLocation: normalizeString(payload.lastSeenLocation),
  foundLocation: normalizeString(payload.foundLocation),
  lostDate: normalizeString(payload.lostDate),
  foundDate: normalizeString(payload.foundDate),
  description: normalizeString(payload.description),
  petPicture: normalizeString(payload.petPicture),
});

export const validateLostPetPayload = (payload) => {
  const normalizedPayload = normalizeLostFoundPayload(payload);

  assertRequiredFields(normalizedPayload, [
    "petName",
    "animalType",
    "colors",
    "ownerName",
    "contactPhone",
    "lastSeenLocation",
    "lostDate",
    "description",
    "petPicture",
  ]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  return normalizedPayload;
};

export const validateFoundPetPayload = (payload) => {
  const normalizedPayload = normalizeLostFoundPayload(payload);

  assertRequiredFields(normalizedPayload, [
    "animalType",
    "colors",
    "gender",
    "founderName",
    "contactPhone",
    "foundLocation",
    "foundDate",
    "description",
    "petPicture",
  ]);
  assertValidEmail(normalizedPayload.contactEmail, "contact email");

  return normalizedPayload;
};
