import express from "express";

import {
  addFoundPet,
  addLostPet,
  getFoundPets,
  getLostPets,
} from "./lost-found.controller.js";
import { uploadFoundPets, uploadLostPets } from "../../utils/cloudnary.js";

const router = express.Router();

router
  .route("/lost-pets")
  .get(getLostPets)
  .post(uploadLostPets.single("petPicture"), addLostPet);

router
  .route("/found-pets")
  .get(getFoundPets)
  .post(uploadFoundPets.single("petPicture"), addFoundPet);

export default router;
