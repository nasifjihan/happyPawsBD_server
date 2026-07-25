import {
  boardingConfirmationEmail,
  groomingConfirmationEmail,
  sendAdoptionConfirmationEmail,
  trainingConfirmationEmail,
} from "../helper/mailer.js";
import {
  AdoptionApplication,
  BoardingEnrollment,
  GroomingEnrollment,
  PostFoundPet,
  PostLostPet,
  TrainingEnrollment,
} from "../model/Schema.js";

const enrollmentModels = {
  training: TrainingEnrollment,
  grooming: GroomingEnrollment,
  boarding: BoardingEnrollment,
};

const enrollmentEmails = {
  training: trainingConfirmationEmail,
  grooming: groomingConfirmationEmail,
  boarding: boardingConfirmationEmail,
};

export const createLostPetPost = async (payload) => {
  const lostPetPost = new PostLostPet(payload);
  return lostPetPost.save();
};

export const listLostPets = async () => PostLostPet.find();

export const createFoundPetPost = async (payload) => {
  const foundPetPost = new PostFoundPet(payload);
  return foundPetPost.save();
};

export const listFoundPets = async () => PostFoundPet.find();

export const createAdoptionRecord = async (payload) => {
  const adoptionRecord = new AdoptionApplication(payload);
  const savedApplication = await adoptionRecord.save();

  if (payload.contactEmail) {
    await sendAdoptionConfirmationEmail(
      payload.contactEmail,
      payload.adopterName,
      payload.contactEmail,
      payload.contactPhone,
      payload.address,
      payload.experience,
      payload.animalCode,
      payload.animalType
    );
  }

  return savedApplication;
};

export const createProgramEnrollment = async (programType, payload) => {
  const Model = enrollmentModels[programType];
  const sendConfirmationEmail = enrollmentEmails[programType];

  if (!Model || !sendConfirmationEmail) {
    throw new Error(`Unsupported program type: ${programType}`);
  }

  const enrollment = new Model(payload);
  const savedEnrollment = await enrollment.save();

  if (payload.contactEmail) {
    await sendConfirmationEmail(
      payload.contactEmail,
      payload.name,
      payload.address,
      payload.programId
    );
  }

  return savedEnrollment;
};
