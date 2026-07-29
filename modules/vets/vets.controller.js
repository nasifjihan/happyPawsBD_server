import { getVetDirectoryMeta, listVetProviders } from "./vets.service.js";

const normalizePositiveInteger = (value, fallback) => {
  const normalizedValue = Number.parseInt(value, 10);

  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
};

const getPagination = (query) => ({
  page: normalizePositiveInteger(query.page, 1),
  limit: Math.min(normalizePositiveInteger(query.limit, 50), 200),
});

export const listVets = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const division = req.query?.division ? String(req.query.division).trim() : "";
    const city = req.query?.city ? String(req.query.city).trim() : "";
    const district = req.query?.district ? String(req.query.district).trim() : "";
    const q = req.query?.q ? String(req.query.q).trim() : "";

    const result = await listVetProviders({
      page,
      limit,
      division: division || null,
      city: city || null,
      district: district || null,
      q: q || null,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getVetMeta = async (req, res, next) => {
  try {
    const division = req.query?.division ? String(req.query.division).trim() : "";
    const city = req.query?.city ? String(req.query.city).trim() : "";
    const result = await getVetDirectoryMeta({
      division: division || null,
      city: city || null,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
