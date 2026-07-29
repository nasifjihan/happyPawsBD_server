import { SiteSettings } from "../../model/Schema.js";

const defaultKey = "default";

export const getOrCreateSiteSettings = async () => {
  const existing = await SiteSettings.findOne({ key: defaultKey }).lean();
  if (existing) {
    return existing;
  }

  const created = await SiteSettings.create({ key: defaultKey });
  return created.toObject();
};

