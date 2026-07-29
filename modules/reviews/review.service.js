import { Reviews } from "../../model/Schema.js";

export const createReview = async (payload) => {
  const created = await Reviews.create(payload);
  return created.toObject();
};

export const listApprovedReviews = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const filter = { status: "approved" };

  const [items, total] = await Promise.all([
    Reviews.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Reviews.countDocuments(filter),
  ]);

  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

