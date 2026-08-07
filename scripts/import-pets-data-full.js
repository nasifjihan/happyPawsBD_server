import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Connection from "../database/db.js";
import { ensureStartupConfig } from "../config/env.js";
import { PetInfoAnimals, PetInfoBreeds } from "../model/Schema.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const extrasDirectory = path.resolve(currentDirectory, "../../Extras");
const defaultDataPath = path.join(extrasDirectory, "pets_data_full.json");

const userArgument = process.argv[2];
const inputFile = userArgument
  ? path.resolve(process.cwd(), userArgument)
  : defaultDataPath;

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
  if (value === undefined || value === null) return "";
  return String(value)
    .trim()
    .replace(/^["'`]+/, "")
    .replace(/["'`]+$/, "")
    .trim();
};

const cleanupString = (value) => {
  const s = String(value || "").trim();
  const placeholder = "Not specified - verify before production use";
  if (s === placeholder) return "";
  return s;
};

const run = async () => {
  ensureStartupConfig();
  await Connection();

  console.log(`Importing pet data from: ${inputFile}`);
  const raw = await readJsonAbsolute(inputFile);

  const petTypesArray = Array.isArray(raw?.pet_types) ? raw.pet_types : [];
  const breedsArray = Array.isArray(raw?.breeds) ? raw.breeds : [];

  if (!petTypesArray.length) {
    throw new Error("No pet_types array found in the input JSON.");
  }

  const petTypeById = new Map(
    petTypesArray.map((pt) => [Number(pt.id), String(pt.type || "").trim()]),
  );

  const petInfoAnimals = petTypesArray.map((pt) => ({
    type: String(pt.type || "").trim(),
    imageUrl: normalizeMediaUrl(pt.imageUrl),
    imageAlt: String(pt.imageAlt || "").trim(),
    summary: cleanupString(pt.summary),
    idealFor: cleanupString(pt.idealFor),
    commonNeeds: Array.isArray(pt.commonNeeds)
      ? pt.commonNeeds
          .map((entry) => cleanupString(entry))
          .filter(Boolean)
      : [],
  }));

  const petInfoBreeds = [];
  let fallbackId = 1;

  breedsArray.forEach((breed) => {
    const numericPetTypeId = Number(breed?.pet_type_id);
    const type = petTypeById.get(numericPetTypeId) || "";
    if (!type) return;

    const explicitId = Number(breed?.id);
    const id = Number.isFinite(explicitId) && explicitId > 0
      ? explicitId
      : fallbackId;
    if (!Number.isFinite(explicitId) || explicitId <= 0) {
      fallbackId += 1;
    }

    petInfoBreeds.push({
      id,
      type,
      name: cleanupString(breed?.name),
      imageUrl: normalizeMediaUrl(breed?.imageUrl),
      imageAlt: String(breed?.imageAlt || "").trim(),
      origin: cleanupString(breed?.origin),
      size: cleanupString(breed?.size),
      lifespan: cleanupString(breed?.lifespan),
      temperament: Array.isArray(breed?.temperament)
        ? [...new Set(
            breed.temperament
              .map((entry) => cleanupString(entry))
              .filter(Boolean),
          )]
        : [],
      careLevel: cleanupString(breed?.careLevel),
      exerciseNeeds: cleanupString(breed?.exerciseNeeds),
      groomingNeeds: cleanupString(breed?.groomingNeeds),
      goodFor: cleanupString(breed?.goodFor),
      highlights: cleanupString(breed?.highlights),
    });
  });

  console.log(
    `Parsed ${petInfoAnimals.length} animal groups and ${petInfoBreeds.length} breeds.`,
  );

  const animalResult = await upsertMany(PetInfoAnimals, petInfoAnimals, "type");
  const breedResult = await upsertMany(PetInfoBreeds, petInfoBreeds, "id");

  console.log("\nPet info import complete.");
  console.log(
    `Animal groups (${petInfoAnimals.length}):`,
    `matched=${animalResult.matched}, upserted=${animalResult.upserted}, modified=${animalResult.modified}`,
  );
  console.log(
    `Breeds (${petInfoBreeds.length}):`,
    `matched=${breedResult.matched}, upserted=${breedResult.upserted}, modified=${breedResult.modified}`,
  );

  const importedTypes = petInfoAnimals.map((a) => a.type).sort();
  console.log("\nImported animal types:", importedTypes.join(", "));

  const perType = {};
  petInfoBreeds.forEach((b) => {
    perType[b.type] = (perType[b.type] || 0) + 1;
  });
  console.log("Breeds per type:");
  Object.keys(perType)
    .sort()
    .forEach((t) => console.log(`  ${t}: ${perType[t]}`));

  process.exit(0);
};

run().catch((error) => {
  console.error("Pet data import failed:", error.message);
  process.exit(1);
});
