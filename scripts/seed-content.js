import Connection from "../database/db.js";
import { ensureStartupConfig } from "../config/env.js";
import { SiteSettings } from "../model/Schema.js";

const seedContent = async () => {
  ensureStartupConfig();
  await Connection();

  const settings = await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    { upsert: true, new: true }
  ).lean();

  console.log("Seed complete.");
  console.log("Site settings:", settings?._id ? "ready" : "missing");
};

seedContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
