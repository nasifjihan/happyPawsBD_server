import { getProgram, listPrograms } from "./programs.service.js";

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

const allowedTypes = ["training", "grooming", "boarding"];

export const listPublicPrograms = async (req, res, next) => {
  try {
    const type = String(req.params.type || "").trim();
    if (!allowedTypes.includes(type)) {
      res.status(404).json({ message: "Program type not found." });
      return;
    }

    const { page, limit } = getPagination(req.query);
    const q = req.query?.q ? String(req.query.q).trim() : "";

    const result = await listPrograms({
      type,
      page,
      limit,
      q: q || null,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPublicProgram = async (req, res, next) => {
  try {
    const type = String(req.params.type || "").trim();
    if (!allowedTypes.includes(type)) {
      res.status(404).json({ message: "Program type not found." });
      return;
    }

    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid program id is required." });
      return;
    }

    const program = await getProgram({ type, id });

    if (!program) {
      res.status(404).json({ message: "Program not found." });
      return;
    }

    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

