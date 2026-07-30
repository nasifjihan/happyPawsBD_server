import express from "express";

import { requestOnlineConsultation } from "./consultation.controller.js";
import { createRateLimiter } from "../../middleware/simple-rate-limit.js";

const router = express.Router();

const consultationRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15 });

router.post("/online", consultationRateLimiter, requestOnlineConsultation);

export default router;
