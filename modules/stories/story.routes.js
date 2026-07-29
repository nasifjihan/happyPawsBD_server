import express from "express";

import { listStories, submitStory } from "./story.controller.js";

const router = express.Router();

router.get("/", listStories);
router.post("/", submitStory);

export default router;

