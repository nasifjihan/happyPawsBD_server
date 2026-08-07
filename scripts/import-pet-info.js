import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Connection from "../database/db.js";
import { ensureStartupConfig } from "../config/env.js";
import { PetInfoAnimals, PetInfoBreeds } from "../model/Schema.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const extrasDirectory = path.resolve(currentDirectory, "../../Extras");
const defaultLibraryPath = path.join(extrasDirectory, "petInfoLibrary.json");

const userArgument = process.argv[2];
const inputFile = userArgument
  ? path.resolve(process.cwd(), userArgument)
  : defaultLibraryPath;

const readJsonAbsolute = async (filePath) => {
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

const normalizeMediaUrl = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .trim()
    .replace(/^["'`]+/, "")
    .replace(/["'`]+$/, "")
    .trim();
};

const run = async () => {
  ensureStartupConfig();
  await Connection();

  console.log(`Importing Pet Info library from: ${inputFile}`);
  const petInfoLibrary = await readJsonAbsolute(inputFile);

  if (!Array.isArray(petInfoLibrary)) {
    throw new Error("Pet Info library JSON must be a top-level array of animal groups.");
  }

  const petInfoAnimals = petInfoLibrary.map((group) => ({
    type: String(group?.type || "").trim(),
    imageUrl: normalizeMediaUrl(group?.imageUrl),
    imageAlt: String(group?.imageAlt || "").trim(),
    summary: String(group?.summary || "").trim(),
    idealFor: String(group?.idealFor || "").trim(),
    commonNeeds: Array.isArray(group?.commonNeeds)
      ? group.commonNeeds.map((entry) => String(entry).trim()).filter(Boolean)
      : [],
  }));

  const petInfoBreeds = [];
  let petInfoBreedIdFallback = 1;

  petInfoLibrary.forEach((group) => {
    const groupType = String(group?.type || "").trim();
    if (!groupType) return;

    if (!Array.isArray(group?.breeds)) return;

    group.breeds.forEach((breed) => {
      const explicitId = Number(breed?.id);
      const id = Number.isFinite(explicitId) && explicitId > 0
        ? explicitId
        : petInfoBreedIdFallback;
      if (!Number.isFinite(explicitId) || explicitId <= 0) {
        petInfoBreedIdFallback += 1;
      }

      petInfoBreeds.push({
        id,
        type: groupType,
        name: String(breed?.name || "").trim(),
        imageUrl: normalizeMediaUrl(breed?.imageUrl),
        imageAlt: String(breed?.imageAlt || "").trim(),
        origin: String(breed?.origin || "").trim(),
        size: String(breed?.size || "").trim(),
        lifespan: String(breed?.lifespan || "").trim(),
        temperament: Array.isArray(breed?.temperament)
          ? breed.temperament.map((trait) => String(trait).trim()).filter(Boolean)
          : [],
        careLevel: String(breed?.careLevel || "").trim(),
        exerciseNeeds: String(breed?.exerciseNeeds || "").trim(),
        groomingNeeds: String(breed?.groomingNeeds || "").trim(),
        goodFor: String(breed?.goodFor || "").trim(),
        highlights: String(breed?.highlights || "").trim(),
      });
    });
  });

  const petInfoAnimalsResult = await upsertMany(PetInfoAnimals, petInfoAnimals, "type");
  const petInfoBreedsResult = await upsertMany(PetInfoBreeds, petInfoBreeds, "id");

  console.log("\nPet Info import complete.");
  console.log(
    `Animal groups: ${petInfoAnimals.length} total`,
    `(matched=${petInfoAnimalsResult.matched}, upserted=${petInfoAnimalsResult.upserted}, modified=${petInfoAnimalsResult.modified})`,
  );
  console.log(
    `Breeds: ${petInfoBreeds.length} total`,
    `(matched=${petInfoBreedsResult.matched}, upserted=${petInfoBreedsResult.upserted}, modified=${petInfoBreedsResult.modified})`,
  );
  process.exit(0);
};

run().catch((error) => {
  console.error("Pet Info import failed:", error.message);
  process.exit(1);
});
