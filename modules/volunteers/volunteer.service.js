import { VolunteerApplication } from "../../model/Schema.js";

export const createVolunteerApplication = async (payload) => {
  const volunteerApplication = new VolunteerApplication(payload);
  const savedApplication = await volunteerApplication.save();

  return savedApplication;
};
