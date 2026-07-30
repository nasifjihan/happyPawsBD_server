import express from "express";

import { getBlogPost, listBlogPosts } from "./blog-post.controller.js";

const router = express.Router();

router.get("/", listBlogPosts);
router.get("/:id", getBlogPost);

export default router;
