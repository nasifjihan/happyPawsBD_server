import { listVetAuthors } from "./vet-authors.service.js";

const normalizePositiveInteger = (value, fallback) => {
  const normalizedValue = Number.parseInt(value, 10);

  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
};

const getPagination = (query) => ({
  page: normalizePositiveInteger(query.page, 1),
  limit: Math.min(normalizePositiveInteger(query.limit, 12), 100),
});

export const listVetAuthorsPublic = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const q = req.query?.q ? String(req.query.q).trim() : "";

    const result = await listVetAuthors({
      page,
      limit,
      q: q || null,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

