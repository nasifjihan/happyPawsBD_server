import express from "express";

import { requestOnlineConsultation } from "./consultation.controller.js";

const router = express.Router();

router.post("/online", requestOnlineConsultation);

export default router;
