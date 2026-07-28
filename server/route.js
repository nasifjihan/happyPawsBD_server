import express from "express";

import apiV1Routes from "./routes/api-v1.js";

const router = express.Router();

router.use("/api/v1", apiV1Routes);

export default router;
