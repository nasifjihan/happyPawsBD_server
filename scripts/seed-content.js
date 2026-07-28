import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Connection from "../database/db.js";
import { ensureStartupConfig } from "../config/env.js";
import { AdoptableAnimals, ShopItems } from "../model/Schema.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const dataDirectory = path.resolve(currentDirectory, "../data");

const readJson = async (fileName) => {
  const filePath = path.join(dataDirectory, fileName);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
};

const upsertMany = async (model, docs, uniqueKey) => {
  if (!Array.isArray(docs) || docs.length === 0) {
    return { inserted: 0, modified: 0, matched: 0, upserted: 0 };
  }

  const operations = docs
    .filter((doc) => doc && doc[uniqueKey] !== undefined && doc[uniqueKey] !== null)
    .map((doc) => ({
      updateOne: {
        filter: { [uniqueKey]: doc[uniqueKey] },
        update: { $set: doc },
        upsert: true,
      },
    }));

  if (operations.length === 0) {
    return { inserted: 0, modified: 0, matched: 0, upserted: 0 };
  }

  const result = await model.bulkWrite(operations, { ordered: false });

  return {
    inserted: result.insertedCount || 0,
    matched: result.matchedCount || 0,
    modified: result.modifiedCount || 0,
    upserted: result.upsertedCount || 0,
  };
};

const seedContent = async () => {
  ensureStartupConfig();
  await Connection();

  const [adoptableAnimals, shopItems] = await Promise.all([
    readJson("adoptableAnimals.json"),
    readJson("shopItems.json"),
  ]);

  const [adoptableResult, shopResult] = await Promise.all([
    upsertMany(AdoptableAnimals, adoptableAnimals, "code"),
    upsertMany(ShopItems, shopItems, "id"),
  ]);

  console.log("Seed complete.");
  console.log("Adoptable animals:", adoptableResult);
  console.log("Shop items:", shopResult);
};

seedContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
