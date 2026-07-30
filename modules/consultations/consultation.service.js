import {
  HouseCallRequests,
  InPersonConsultations,
  OnlineConsultations,
} from "../../model/Schema.js";

export const createOnlineConsultation = async (payload) => {
  const consultation = new OnlineConsultations(payload);
  const savedConsultation = await consultation.save();

  return savedConsultation;
};

export const createInPersonConsultation = async (payload) => {
  const consultation = new InPersonConsultations(payload);
  const savedConsultation = await consultation.save();

  return savedConsultation;
};

export const createHouseCallRequest = async (payload) => {
  const request = new HouseCallRequests(payload);
  const savedRequest = await request.save();

  return savedRequest;
};
