import express from "express";

import { addVolunteerApplication } from "./volunteer.controller.js";

const router = express.Router();

router.post("/applications", addVolunteerApplication);

export default router;
