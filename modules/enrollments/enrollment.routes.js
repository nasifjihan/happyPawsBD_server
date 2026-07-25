import express from "express";

import {
  addBoardingEnrollment,
  addGroomingEnrollment,
  addTrainingEnrollment,
} from "./enrollment.controller.js";

const router = express.Router();

router.post("/training/:id", addTrainingEnrollment);
router.post("/grooming/:id", addGroomingEnrollment);
router.post("/boarding/:id", addBoardingEnrollment);

export default router;
