import express from "express";

import { listStories, submitStory } from "./story.controller.js";
import { createRateLimiter } from "../../middlewares/simple-rate-limit.js";

const router = express.Router();

const storyRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

router.get("/", listStories);
router.post("/", storyRateLimiter, submitStory);

export default router;
