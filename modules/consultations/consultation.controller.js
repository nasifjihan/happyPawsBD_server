import { createOnlineConsultation } from "./consultation.service.js";
import { validateOnlineConsultationPayload } from "./consultation.validation.js";

export const requestOnlineConsultation = async (req, res, next) => {
  try {
    const consultationPayload = validateOnlineConsultationPayload(req.body);
    const savedConsultation = await createOnlineConsultation(
      consultationPayload
    );

    res.status(201).json(savedConsultation);
  } catch (error) {
    next(error);
  }
};
