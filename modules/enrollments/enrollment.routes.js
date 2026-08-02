import express from "express";

import {
  addBoardingEnrollment,
  addGroomingEnrollment,
  addTrainingEnrollment,
} from "./enrollment.controller.js";
import { createRateLimiter } from "../../middlewares/simple-rate-limit.js";

const router = express.Router();

const enrollmentRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15 });

router.post("/training/:id", enrollmentRateLimiter, addTrainingEnrollment);
router.post("/grooming/:id", enrollmentRateLimiter, addGroomingEnrollment);
router.post("/boarding/:id", enrollmentRateLimiter, addBoardingEnrollment);

export default router;
