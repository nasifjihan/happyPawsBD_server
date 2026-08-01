import express from "express";

import { listVetAuthorsPublic } from "./vet-authors.controller.js";

const router = express.Router();

router.get("/", listVetAuthorsPublic);

export default router;

