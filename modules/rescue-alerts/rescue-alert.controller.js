import { validateRescueAlertPayload } from "./rescue-alert.validation.js";
import { createRescueAlert } from "./rescue-alert.service.js";

export const submitRescueAlert = async (req, res, next) => {
  try {
    const payload = validateRescueAlertPayload({
      ...req.body,
      photo: req.file?.path,
    });
    const created = await createRescueAlert(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

