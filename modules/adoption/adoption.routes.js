import express from "express";

import {
  addAdoptionApplication,
  getAdoptableAnimal,
  getAdoptableAnimals,
} from "./adoption.controller.js";

const router = express.Router();

router.get("/animals", getAdoptableAnimals);
router.get("/animals/:code", getAdoptableAnimal);
router.post("/applications/:code", addAdoptionApplication);

export default router;
