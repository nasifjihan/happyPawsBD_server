import express from "express";

import {
  addAdoptionApplication,
  getAdoptableAnimal,
  getAdoptableAnimals,
} from "./adoption.controller.js";
import { createRateLimiter } from "../../middleware/simple-rate-limit.js";

const router = express.Router();

const adoptionRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 10 });

router.get("/animals", getAdoptableAnimals);
router.get("/animals/:code", getAdoptableAnimal);
router.post("/applications/:code", adoptionRateLimiter, addAdoptionApplication);

export default router;
