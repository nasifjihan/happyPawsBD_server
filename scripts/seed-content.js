import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Connection from "../database/db.js";
import { ensureStartupConfig } from "../config/env.js";
import {
  AdoptableAnimals,
  BoardingPrograms,
  CommunityStories,
  GroomingPrograms,
  SiteSettings,
  TrainingPrograms,
  VetProviders,
} from "../model/Schema.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const dataDirectory = path.resolve(currentDirectory, "../data");

const readJson = async (fileName) => {
  const filePath = path.join(dataDirectory, fileName);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
};

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
    return value;
  }

  return String(value)
    .trim()
    .replace(/^["'`]+/, "")
    .replace(/["'`]+$/, "")
    .trim();
};

const seedContent = async () => {
  ensureStartupConfig();
  await Connection();

  const adoptableAnimals = await readJson("adoptableAnimals.json");
  const adoptableResult = await upsertMany(
    AdoptableAnimals,
    adoptableAnimals,
    "code"
  );

  const veterinaryDataPath = path.resolve(
    currentDirectory,
    "../../happyPawsBD_client/src/API/veterinary.json"
  );
  const vetProviders = await readJsonAbsolute(veterinaryDataPath);
  const vetResult = await upsertMany(
    VetProviders,
    vetProviders.map((provider) => ({
      ...provider,
      image: normalizeMediaUrl(provider?.image),
    })),
    "id"
  );

  const trainingMeta = {
    1: {
      duration: "6 weeks",
      price: "BDT 4,500",
      programCovers:
        "Sit, stay, recall, leash manners, and owner communication basics.",
    },
    2: {
      duration: "4 weeks",
      price: "BDT 3,000",
      programCovers:
        "Routine building, potty cues, crate support, and home consistency tips.",
    },
    3: {
      duration: "5 weeks",
      price: "BDT 3,800",
      programCovers: "Loose-leash walking, outdoor focus, and calmer public walks.",
    },
    4: {
      duration: "5 weeks",
      price: "BDT 4,000",
      programCovers:
        "Confidence building, healthy introductions, and positive exposure work.",
    },
    5: {
      duration: "8 weeks",
      price: "BDT 6,000",
      programCovers:
        "Behavior assessment, redirection plans, and ongoing owner guidance.",
    },
    6: {
      duration: "Custom schedule",
      price: "Consultation required",
      programCovers:
        "Trainer assessment, suitability review, and closely supervised guidance.",
    },
  };

  const trainingPath = path.resolve(
    currentDirectory,
    "../../happyPawsBD_client/src/API/training.json"
  );
  const trainingPrograms = await readJsonAbsolute(trainingPath);
  const trainingResult = await upsertMany(
    TrainingPrograms,
    trainingPrograms.map((program) => ({
      ...program,
      picture: normalizeMediaUrl(program?.picture),
      ...(trainingMeta[program?.id] || {}),
    })),
    "id"
  );

  const groomingPath = path.resolve(
    currentDirectory,
    "../../happyPawsBD_client/src/API/petGrooming.json"
  );
  const groomingPrograms = await readJsonAbsolute(groomingPath);
  const groomingResult = await upsertMany(
    GroomingPrograms,
    groomingPrograms.map((program) => ({
      ...program,
      picture: normalizeMediaUrl(program?.picture),
      duration: program?.duration || program?.Duration || "",
      price: program?.price || program?.Price || "",
      programCovers: program?.programCovers || program?.ProgramCovers || "",
    })),
    "id"
  );

  const boardingPath = path.resolve(
    currentDirectory,
    "../../happyPawsBD_client/src/API/petBoarding.json"
  );
  const boardingPrograms = await readJsonAbsolute(boardingPath);
  const boardingResult = await upsertMany(
    BoardingPrograms,
    boardingPrograms.map((program) => ({
      ...program,
      picture: normalizeMediaUrl(program?.picture),
    })),
    "id"
  );

  const communityStories = await readJson("communityStories.json");
  const communityStoryResult = await upsertMany(
    CommunityStories,
    communityStories.map((entry) => ({
      ...entry,
      image: normalizeMediaUrl(entry?.image),
    })),
    "id"
  );

  const rawSiteSettings = await readJson("siteSettings.json");
  const siteSettings = {
    ...rawSiteSettings,
    mapUrl: normalizeMediaUrl(rawSiteSettings?.mapUrl),
    mapEmbedUrl: normalizeMediaUrl(rawSiteSettings?.mapEmbedUrl),
    facebookUrl: normalizeMediaUrl(rawSiteSettings?.facebookUrl),
    instagramUrl: normalizeMediaUrl(rawSiteSettings?.instagramUrl),
    youtubeUrl: normalizeMediaUrl(rawSiteSettings?.youtubeUrl),
    homeHeroImageUrl: normalizeMediaUrl(rawSiteSettings?.homeHeroImageUrl),
  };
  const siteSettingsResult = await upsertMany(SiteSettings, [siteSettings], "key");

  console.log("Seed complete.");
  console.log("Adoptable animals:", adoptableResult);
  console.log("Vet providers:", vetResult);
  console.log("Training programs:", trainingResult);
  console.log("Grooming programs:", groomingResult);
  console.log("Boarding programs:", boardingResult);
  console.log("Stories:", communityStoryResult);
  console.log("Site settings:", siteSettingsResult);
};

seedContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
