import { BlogPosts } from "../../model/Schema.js";

export const listPublishedBlogPosts = async ({
  page,
  limit,
  category,
  featured,
  q,
} = {}) => {
  const skip = (page - 1) * limit;
  const filter = { status: "published" };

  if (category) {
    filter.category = category;
  }

  if (featured) {
    filter.featured = true;
  }

  if (q) {
    const regexSource = String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(regexSource, "i");
    filter.$or = [
      { title: regex },
      { excerpt: regex },
      { content: regex },
      { authorName: regex },
      { category: regex },
      { tags: regex },
    ];
  }

  const sort = { featured: -1, publishedAt: -1, createdAt: -1 };
  const [items, total] = await Promise.all([
    BlogPosts.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    BlogPosts.countDocuments(filter),
  ]);

  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const getPublishedBlogPostById = async (id) => {
  const post = await BlogPosts.findOne({ id, status: "published" }).lean();
  return post || null;
};

