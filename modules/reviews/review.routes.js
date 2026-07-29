import express from "express";

import { listReviews, submitReview } from "./review.controller.js";

const router = express.Router();

router.get("/", listReviews);
router.post("/", submitReview);

export default router;

