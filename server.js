import http from "http";

import app from "./app.js";
import Connection from "./database/db.js";
import { ensureStartupConfig, env } from "./config/env.js";
import { ensureSeedAdminCredential } from "./modules/admin/admin.service.js";

globalThis.__HPBD_DATABASE_READY__ = false;

const startServer = async () => {
  ensureStartupConfig();

  await Connection();
  globalThis.__HPBD_DATABASE_READY__ = true;
  await ensureSeedAdminCredential();

  const server = http.createServer(app);

  server.listen(env.port, env.host, () => {
    console.log(
      `Happy Paws BD Server is running successfully on PORT ${env.port} & HOST ${env.host}`
    );
  });

  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down Happy Paws BD server...`);
    server.close((serverError) => {
      if (serverError) {
        console.error("Error while closing the server:", serverError);
        process.exit(1);
      }

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  globalThis.__HPBD_DATABASE_READY__ = false;
  console.error("Failed to start Happy Paws BD server:", error.message);
  process.exit(1);
});
