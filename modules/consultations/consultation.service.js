import { OnlineConsultations } from "../../model/Schema.js";

export const createOnlineConsultation = async (payload) => {
  const consultation = new OnlineConsultations(payload);
  const savedConsultation = await consultation.save();

  return savedConsultation;
};
