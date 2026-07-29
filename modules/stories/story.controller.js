import { validateStorySubmissionPayload } from "./story.validation.js";
import { createStorySubmission, listPublishedStories } from "./story.service.js";

const normalizePositiveInteger = (value, fallback) => {
  const normalizedValue = Number.parseInt(value, 10);

  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
};

const getPagination = (query) => ({
  page: normalizePositiveInteger(query.page, 1),
  limit: Math.min(normalizePositiveInteger(query.limit, 9), 50),
});

export const submitStory = async (req, res, next) => {
  try {
    const payload = validateStorySubmissionPayload(req.body);
    const created = await createStorySubmission(payload);
    res.status(201).json({
      message: "Story submitted successfully.",
      storyId: created.id,
    });
  } catch (error) {
    next(error);
  }
};

export const listStories = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const category = req.query?.category ? String(req.query.category).trim() : "";
    const featured = req.query?.featured === "true" || req.query?.featured === "1";

    const result = await listPublishedStories({
      page,
      limit,
      category: category || null,
      featured,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

