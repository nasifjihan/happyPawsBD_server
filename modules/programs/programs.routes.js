import express from "express";

import { getPublicProgram, listPublicPrograms } from "./programs.controller.js";

const router = express.Router();

router.get("/:type", listPublicPrograms);
router.get("/:type/:id", getPublicProgram);

export default router;

