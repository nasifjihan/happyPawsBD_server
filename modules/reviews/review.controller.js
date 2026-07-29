import { validateReviewPayload } from "./review.validation.js";
import { createReview, listApprovedReviews } from "./review.service.js";

const normalizePositiveInteger = (value, fallback) => {
  const normalizedValue = Number.parseInt(value, 10);

  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
};

const getPagination = (query) => ({
  page: normalizePositiveInteger(query.page, 1),
  limit: Math.min(normalizePositiveInteger(query.limit, 12), 50),
});

export const submitReview = async (req, res, next) => {
  try {
    const payload = validateReviewPayload(req.body);
    const created = await createReview(payload);
    res.status(201).json({
      message: "Review submitted successfully.",
      reviewId: created._id,
    });
  } catch (error) {
    next(error);
  }
};

export const listReviews = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const result = await listApprovedReviews({ page, limit });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

