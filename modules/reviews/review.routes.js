import express from "express";

import { listReviews, submitReview } from "./review.controller.js";
import { createRateLimiter } from "../../middleware/simple-rate-limit.js";

const router = express.Router();

const reviewRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

router.get("/", listReviews);
router.post("/", reviewRateLimiter, submitReview);

export default router;
