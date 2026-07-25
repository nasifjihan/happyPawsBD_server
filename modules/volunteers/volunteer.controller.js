import { createVolunteerApplication } from "./volunteer.service.js";
import { validateVolunteerApplicationPayload } from "./volunteer.validation.js";

export const addVolunteerApplication = async (req, res, next) => {
  try {
    const volunteerApplication = validateVolunteerApplicationPayload(req.body);
    const savedApplication = await createVolunteerApplication(
      volunteerApplication
    );

    res.status(201).json(savedApplication);
  } catch (error) {
    next(error);
  }
};
