import { RescueAlerts } from "../../model/Schema.js";

export const getNextRescueAlertId = async () => {
  const latest = await RescueAlerts.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  return Number(latest?.id || 0) + 1;
};

export const createRescueAlert = async (payload) => {
  const id = await getNextRescueAlertId();
  const created = await RescueAlerts.create({
    ...payload,
    id,
    status: "new",
  });
  return created.toObject ? created.toObject() : created;
};

