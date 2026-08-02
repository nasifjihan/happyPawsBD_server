import express from "express";

import { submitRescueAlert } from "./rescue-alert.controller.js";
import { uploadRescueAlerts } from "../../utils/cloudnary.js";
import { createRateLimiter } from "../../middlewares/simple-rate-limit.js";

const router = express.Router();

const rescueAlertRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15 });

router.post("/", rescueAlertRateLimiter, uploadRescueAlerts, submitRescueAlert);

export default router;
