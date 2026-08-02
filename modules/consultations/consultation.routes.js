import express from "express";

import {
  requestHouseCall,
  requestInPersonConsultation,
  requestOnlineConsultation,
} from "./consultation.controller.js";
import { createRateLimiter } from "../../middlewares/simple-rate-limit.js";

const router = express.Router();

const consultationRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15 });

router.post("/online", consultationRateLimiter, requestOnlineConsultation);
router.post("/in-person", consultationRateLimiter, requestInPersonConsultation);
router.post("/house-calls", consultationRateLimiter, requestHouseCall);

export default router;
