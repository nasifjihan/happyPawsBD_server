import express from "express";

import { getPetInfoAnimals, getPetInfoLibrary } from "./pet-info.controller.js";

const router = express.Router();

router.get("/animals", getPetInfoAnimals);
router.get("/library", getPetInfoLibrary);

export default router;
