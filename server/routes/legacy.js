import express from "express";

import {
  addFoundPet,
  addLostPet,
  getFoundPets,
  getLostPets,
} from "../../modules/lost-found/lost-found.controller.js";
import { addAdoptionApplication } from "../../modules/adoption/adoption.controller.js";
import {
  addBoardingEnrollment,
  addGroomingEnrollment,
  addTrainingEnrollment,
} from "../../modules/enrollments/enrollment.controller.js";
import { createOrder } from "../../modules/orders/order.controller.js";
import { createPayment } from "../../modules/payments/payment.controller.js";
import { uploadFoundPets, uploadLostPets } from "../../utils/cloudnary.js";

const router = express.Router();

router.post(
  "/lost_found/lost_form",
  uploadLostPets.single("petPicture"),
  addLostPet
);
router.get("/lost_found/lost_pets", getLostPets);

router.post(
  "/lost_found/found_form",
  uploadFoundPets.single("petPicture"),
  addFoundPet
);
router.get("/lost_found/found_pets", getFoundPets);

router.post("/adoption/adoptable_pets/:code", addAdoptionApplication);
router.post("/training/:id", addTrainingEnrollment);
router.post("/petcare/grooming/:id", addGroomingEnrollment);
router.post("/petcare/boarding/:id", addBoardingEnrollment);
router.post("/cart/orders", createOrder);
router.post("/cart/orders/create-payment", createPayment);

export default router;
