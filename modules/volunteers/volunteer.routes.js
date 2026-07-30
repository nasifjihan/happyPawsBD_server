import express from "express";

import { addVolunteerApplication } from "./volunteer.controller.js";
import { createRateLimiter } from "../../middleware/simple-rate-limit.js";

const router = express.Router();

const volunteerRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15 });

router.post("/applications", volunteerRateLimiter, addVolunteerApplication);

export default router;
