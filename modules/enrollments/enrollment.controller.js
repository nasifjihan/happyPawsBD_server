import { validateProgramEnrollmentPayload } from "./enrollment.validation.js";
import { createProgramEnrollment } from "./enrollment.service.js";

const handleEnrollmentRequest = (programType) => async (req, res, next) => {
  try {
    const enrollmentPayload = validateProgramEnrollmentPayload(
      req.body,
      req.params.id
    );
    const savedEnrollment = await createProgramEnrollment(
      programType,
      enrollmentPayload
    );
    res.status(201).json(savedEnrollment);
  } catch (error) {
    next(error);
  }
};

export const addTrainingEnrollment = handleEnrollmentRequest("training");
export const addGroomingEnrollment = handleEnrollmentRequest("grooming");
export const addBoardingEnrollment = handleEnrollmentRequest("boarding");
