import { sendAdoptionConfirmationEmail } from "../../helper/mailer.js";
import { AdoptionApplication } from "../../model/Schema.js";
import { AdoptableAnimals } from "../../model/Schema.js";
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

export const listAdoptableAnimals = async () => {
  return AdoptableAnimals.find().sort({ code: 1 }).lean();
};

export const findAdoptableAnimalByCode = async (code) => {
  return AdoptableAnimals.findOne({ code }).lean();
};
