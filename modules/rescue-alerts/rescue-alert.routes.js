import express from "express";

import { submitRescueAlert } from "./rescue-alert.controller.js";
import { uploadRescueAlerts } from "../../utils/cloudnary.js";
import { createRateLimiter } from "../../middleware/simple-rate-limit.js";

const router = express.Router();

const rescueAlertRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15 });

router.post("/", rescueAlertRateLimiter, uploadRescueAlerts.single("photo"), submitRescueAlert);

export default router;
