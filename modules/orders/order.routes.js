import express from "express";

import { createOrder, getOrderByPublicToken } from "./order.controller.js";

const router = express.Router();

router.get("/public/:token", getOrderByPublicToken);
router.post("/", createOrder);

export default router;
