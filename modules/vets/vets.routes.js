import express from "express";

import { getVetMeta, listVets } from "./vets.controller.js";

const router = express.Router();

router.get("/meta", getVetMeta);
router.get("/", listVets);

export default router;
