import { sendAdoptionConfirmationEmail } from "../../helper/mailer.js";
import { AdoptionApplication } from "../../model/Schema.js";
import { AdoptableAnimals } from "../../model/Schema.js";
import { getAdoptableAnimals } from "../../utils/content-store.js";
import { runSideEffect } from "../../utils/sideEffects.js";

export const createAdoptionRecord = async (payload) => {
  const adoptionRecord = new AdoptionApplication(payload);
  const savedApplication = await adoptionRecord.save();

  if (payload.contactEmail) {
    runSideEffect("Adoption confirmation email", () =>
      sendAdoptionConfirmationEmail(
        payload.contactEmail,
        payload.adopterName,
        payload.contactEmail,
        payload.contactPhone,
        payload.address,
        payload.experience,
        payload.animalCode,
        payload.animalType
      )
    );
  }

  return savedApplication;
};

const hasDatabaseRecords = async () => {
  const recordCount = await AdoptableAnimals.estimatedDocumentCount();
  return recordCount > 0;
};

export const listAdoptableAnimals = async () => {
  if (await hasDatabaseRecords()) {
    return AdoptableAnimals.find().sort({ code: 1 }).lean();
  }

  return getAdoptableAnimals();
};

export const findAdoptableAnimalByCode = async (code) => {
  if (await hasDatabaseRecords()) {
    return AdoptableAnimals.findOne({ code }).lean();
  }

  const adoptableAnimals = await getAdoptableAnimals();
  return adoptableAnimals.find((animal) => animal.code === code) || null;
};
