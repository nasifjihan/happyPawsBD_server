import { validateAdoptionPayload } from "./adoption.validation.js";
import { createAdoptionRecord } from "./adoption.service.js";

export const addAdoptionApplication = async (req, res, next) => {
  try {
    const adoptionApplication = validateAdoptionPayload(
      req.body,
      req.params.code
    );
    const savedApplication = await createAdoptionRecord(adoptionApplication);
    res.status(201).json(savedApplication);
  } catch (error) {
    next(error);
  }
};
