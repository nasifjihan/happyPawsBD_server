import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Connection from "../database/db.js";
import { ensureStartupConfig } from "../config/env.js";
import { PetInfoAnimals, PetInfoBreeds } from "../model/Schema.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const extrasDirectory = path.resolve(currentDirectory, "../../Extras");
const outputPath = path.join(extrasDirectory, "petInfoLibrary.json");

const run = async () => {
  ensureStartupConfig();
  await Connection();

  const animals = await PetInfoAnimals.find({}).sort({ type: 1 }).lean();
  const breeds = await PetInfoBreeds.find({}).sort({ type: 1, id: 1 }).lean();

  const breedCount = {};
  breeds.forEach((b) => {
    breedCount[b.type] = (breedCount[b.type] || 0) + 1;
  });

  const library = animals.map((a) => ({
    type: a.type,
    imageUrl: a.imageUrl || "",
    imageAlt: a.imageAlt || "",
    summary: a.summary || "",
    idealFor: a.idealFor || "",
    commonNeeds: Array.isArray(a.commonNeeds) ? a.commonNeeds : [],
    breeds: breeds
      .filter((b) => b.type === a.type)
      .map((b) => ({
        id: typeof b.id === "number" ? b.id : Number(b.id),
        name: b.name || "",
        imageUrl: b.imageUrl || "",
        imageAlt: b.imageAlt || "",
        origin: b.origin || "",
        size: b.size || "",
        lifespan: b.lifespan || "",
        temperament: Array.isArray(b.temperament) ? b.temperament : [],
        careLevel: b.careLevel || "",
        exerciseNeeds: b.exerciseNeeds || "",
        groomingNeeds: b.groomingNeeds || "",
        goodFor: b.goodFor || "",
        highlights: b.highlights || "",
      })),
  }));

  await writeFile(outputPath, JSON.stringify(library, null, 2), "utf-8");
  console.log(`Exported ${library.length} animal groups and ${breeds.length} breeds to:`);
  console.log(outputPath);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
