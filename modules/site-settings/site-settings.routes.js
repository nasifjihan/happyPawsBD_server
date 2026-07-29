import express from "express";

import { getPublicSiteSettings } from "./site-settings.controller.js";

const router = express.Router();

router.get("/", getPublicSiteSettings);

export default router;

