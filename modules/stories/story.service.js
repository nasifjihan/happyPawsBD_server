import { CommunityStories } from "../../model/Schema.js";

const nextStoryId = async () => {
  const latest = await CommunityStories.findOne({}, { id: 1 })
    .sort({ id: -1 })
    .lean();

  return Number(latest?.id || 0) + 1;
};

export const createStorySubmission = async (payload) => {
  const id = await nextStoryId();
  const created = await CommunityStories.create({
    ...payload,
    id,
    status: "new",
  });
  return created.toObject();
};

export const listPublishedStories = async ({
  page,
  limit,
  category,
  featured,
} = {}) => {
  const skip = (page - 1) * limit;
  const filter = { status: "published" };

  if (category) {
    filter.category = category;
  }

  if (featured) {
    filter.featured = true;
  }

  const sort = featured ? { featured: -1, createdAt: -1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    CommunityStories.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    CommunityStories.countDocuments(filter),
  ]);

  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

