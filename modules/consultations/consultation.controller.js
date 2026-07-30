import {
  createHouseCallRequest,
  createInPersonConsultation,
  createOnlineConsultation,
} from "./consultation.service.js";
import {
  validateHouseCallPayload,
  validateInPersonConsultationPayload,
  validateOnlineConsultationPayload,
} from "./consultation.validation.js";

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

export const requestInPersonConsultation = async (req, res, next) => {
  try {
    const consultationPayload = validateInPersonConsultationPayload(req.body);
    const savedConsultation = await createInPersonConsultation(
      consultationPayload
    );

    res.status(201).json(savedConsultation);
  } catch (error) {
    next(error);
  }
};

export const requestHouseCall = async (req, res, next) => {
  try {
    const requestPayload = validateHouseCallPayload(req.body);
    const savedRequest = await createHouseCallRequest(requestPayload);

    res.status(201).json(savedRequest);
  } catch (error) {
    next(error);
  }
};
