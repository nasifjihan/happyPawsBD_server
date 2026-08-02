import express from "express";

import {
  addFoundPet,
  addLostPet,
  getFoundPets,
  getLostPets,
} from "./lost-found.controller.js";
import { uploadFoundPets, uploadLostPets } from "../../utils/cloudnary.js";
import { createRateLimiter } from "../../middlewares/simple-rate-limit.js";

const router = express.Router();

const lostFoundRateLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

router
  .route("/lost-pets")
  .get(getLostPets)
  .post(lostFoundRateLimiter, uploadLostPets, addLostPet);

router
  .route("/found-pets")
  .get(getFoundPets)
  .post(lostFoundRateLimiter, uploadFoundPets, addFoundPet);

export default router;
