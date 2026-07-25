import { sendAdoptionConfirmationEmail } from "../../helper/mailer.js";
import { AdoptionApplication } from "../../model/Schema.js";
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
