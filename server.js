import http from "http";
import mongoose from "mongoose";

import app from "./app.js";
import Connection from "./database/db.js";
import { ensureStartupConfig, env } from "./config/env.js";
import { ensureSeedAdminCredential } from "./modules/admin/admin.service.js";

export const startServer = async () => {
  ensureStartupConfig();

  await Connection();
  app.locals.databaseReady = true;
  await ensureSeedAdminCredential();

  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(env.port, env.host, () => resolve());
  });

  console.log(
    `Happy Paws BD Server is running successfully on PORT ${env.port} & HOST ${env.host}`
  );

  let shuttingDown = false;

  const shutdown = async (signal) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log(`${signal} received. Shutting down Happy Paws BD server...`);

    await new Promise((resolve) => {
      server.close(() => resolve());
    });

    await mongoose.disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return { server, shutdown };
};

export default startServer;
