import { VetAuthors } from "../../model/Schema.js";

export const listVetAuthors = async ({ page, limit, q }) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { name: regex },
      { specialization: regex },
      { location: regex },
      { contact: regex },
    ];
  }

  const [items, total] = await Promise.all([
    VetAuthors.find(filter).sort({ id: 1 }).skip(skip).limit(limit).lean(),
    VetAuthors.countDocuments(filter),
  ]);

  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

