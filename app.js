import express from "express";
import cors from "cors";
import morgan from "morgan";

import Routes from "./routes/route.js";
import { corsOptions } from "./config/cors.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { handleStripeWebhook } from "./modules/payments/payment.controller.js";
import { notFoundHandler } from "./middlewares/not-found.js";

const app = express();
app.locals.databaseReady = false;

app.disable("x-powered-by");
app.use(morgan("dev"));
app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Happy Paws BD API is running.",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/ready", (req, res) => {
  const databaseState = app.locals.databaseReady === true;

  res.status(databaseState ? 200 : 503).json({
    status: databaseState ? "ready" : "not_ready",
    database: databaseState ? "connected" : "disconnected",
  });
});

app.use("/", Routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
