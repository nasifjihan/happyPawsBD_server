import { getOrCreateSiteSettings } from "./site-settings.service.js";

export const getPublicSiteSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSiteSettings();
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

