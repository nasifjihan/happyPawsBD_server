import express from "express";

import { addAdoptionApplication } from "./adoption.controller.js";

const router = express.Router();

router.post("/applications/:code", addAdoptionApplication);

export default router;
