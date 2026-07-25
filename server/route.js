import express from "express";

import apiV1Routes from "./routes/api-v1.js";
import legacyRoutes from "./routes/legacy.js";

const router = express.Router();

router.use("/api/v1", apiV1Routes);
router.use("/", legacyRoutes);

export default router;
