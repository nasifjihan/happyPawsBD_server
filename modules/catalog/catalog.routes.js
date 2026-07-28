import express from "express";

import { getShopItems } from "./catalog.controller.js";

const router = express.Router();

router.get("/shop-items", getShopItems);

export default router;
