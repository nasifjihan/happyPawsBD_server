import {
  boardingConfirmationEmail,
  groomingConfirmationEmail,
  trainingConfirmationEmail,
} from "../../helper/mailer.js";
import {
  BoardingEnrollment,
  GroomingEnrollment,
  TrainingEnrollment,
} from "../../model/Schema.js";
import { runSideEffect } from "../../utils/sideEffects.js";

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

export const createProgramEnrollment = async (programType, payload) => {
  const Model = enrollmentModels[programType];
  const sendConfirmationEmail = enrollmentEmails[programType];

  if (!Model || !sendConfirmationEmail) {
    const error = new Error(`Unsupported program type: ${programType}`);
    error.statusCode = 400;
    throw error;
  }

  const enrollment = new Model(payload);
  const savedEnrollment = await enrollment.save();

  if (payload.contactEmail) {
    runSideEffect(`${programType} confirmation email`, () =>
      sendConfirmationEmail(
        payload.contactEmail,
        payload.name,
        payload.address,
        payload.programId
      )
    );
  }

  return savedEnrollment;
};
