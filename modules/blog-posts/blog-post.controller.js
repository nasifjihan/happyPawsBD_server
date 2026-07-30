import {
  getPagination,
  normalizeBlogId,
} from "./blog-post.validation.js";
import {
  getPublishedBlogPostById,
  listPublishedBlogPosts,
} from "./blog-post.service.js";

export const listBlogPosts = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const category = req.query?.category ? String(req.query.category).trim() : "";
    const featured = req.query?.featured === "true" || req.query?.featured === "1";
    const q = req.query?.q ? String(req.query.q).trim() : "";

    const result = await listPublishedBlogPosts({
      page,
      limit,
      category: category || null,
      featured,
      q: q || null,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBlogPost = async (req, res, next) => {
  try {
    const id = normalizeBlogId(req.params.id);
    const post = await getPublishedBlogPostById(id);

    if (!post) {
      res.status(404).json({ message: "Blog post not found." });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

