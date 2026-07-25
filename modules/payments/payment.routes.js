import express from "express";

import { createPayment } from "./payment.controller.js";

const router = express.Router();

router.post("/checkout-session", createPayment);

export default router;
