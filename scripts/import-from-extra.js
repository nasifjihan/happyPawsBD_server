import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Connection from "../database/db.js";
import { ensureStartupConfig } from "../config/env.js";
import {
  AdoptableAnimals,
  BoardingPrograms,
  BlogPosts,
  CommunityStories,
  GroomingPrograms,
  PetInfoAnimals,
  PetInfoBreeds,
  SiteSettings,
  TrainingPrograms,
  VetAuthors,
  VetProviders,
} from "../model/Schema.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const extraDirectory = path.resolve(
  currentDirectory,
  "../../happyPawsBD_client/src/Extra"
);

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

const seedFromExtra = async () => {
  ensureStartupConfig();
  await Connection();

  const adoptableAnimals = await readJsonAbsolute(
    path.join(extraDirectory, "adoptableAnimals.json")
  );
  const adoptableResult = await upsertMany(AdoptableAnimals, adoptableAnimals, "code");

  const vetProviders = await readJsonAbsolute(path.join(extraDirectory, "veterinary.json"));
  const vetResult = await upsertMany(
    VetProviders,
    vetProviders.map((provider) => ({
      ...provider,
      image: normalizeMediaUrl(provider?.image),
    })),
    "id"
  );

  const vetAuthors = await readJsonAbsolute(path.join(extraDirectory, "vets.json"));
  const vetAuthorResult = await upsertMany(
    VetAuthors,
    vetAuthors.map((author) => ({
      ...author,
      picture: normalizeMediaUrl(author?.picture),
      details: normalizeMediaUrl(author?.details),
    })),
    "id"
  );

  const trainingMeta = {
    1: {
      duration: "6 weeks",
      price: "BDT 4,500",
      programCovers: "Sit, stay, recall, leash manners, and owner communication basics.",
    },
    2: {
      duration: "4 weeks",
      price: "BDT 3,000",
      programCovers: "Routine building, potty cues, crate support, and home consistency tips.",
    },
    3: {
      duration: "5 weeks",
      price: "BDT 3,800",
      programCovers: "Loose-leash walking, outdoor focus, and calmer public walks.",
    },
    4: {
      duration: "5 weeks",
      price: "BDT 4,000",
      programCovers: "Confidence building, healthy introductions, and positive exposure work.",
    },
    5: {
      duration: "8 weeks",
      price: "BDT 6,000",
      programCovers: "Behavior assessment, redirection plans, and ongoing owner guidance.",
    },
    6: {
      duration: "Custom schedule",
      price: "Consultation required",
      programCovers: "Trainer assessment, suitability review, and closely supervised guidance.",
    },
  };

  const trainingPrograms = await readJsonAbsolute(path.join(extraDirectory, "training.json"));
  const trainingResult = await upsertMany(
    TrainingPrograms,
    trainingPrograms.map((program) => ({
      ...program,
      picture: normalizeMediaUrl(program?.picture),
      ...(trainingMeta[program?.id] || {}),
    })),
    "id"
  );

  const groomingPrograms = await readJsonAbsolute(
    path.join(extraDirectory, "petGrooming.json")
  );
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

  const boardingPrograms = await readJsonAbsolute(
    path.join(extraDirectory, "petBoarding.json")
  );
  const boardingResult = await upsertMany(
    BoardingPrograms,
    boardingPrograms.map((program) => ({
      ...program,
      picture: normalizeMediaUrl(program?.picture),
    })),
    "id"
  );

  const communityStories = await readJsonAbsolute(
    path.join(extraDirectory, "communityStories.json")
  );
  const communityStoryResult = await upsertMany(
    CommunityStories,
    communityStories.map((entry) => ({
      ...entry,
      image: normalizeMediaUrl(entry?.image),
    })),
    "id"
  );

  const blogPosts = await readJsonAbsolute(path.join(extraDirectory, "blogPosts.json"));
  const blogPostsResult = await upsertMany(
    BlogPosts,
    blogPosts.map((entry) => ({
      ...entry,
      coverImageUrl: normalizeMediaUrl(entry?.coverImageUrl),
      externalUrl: normalizeMediaUrl(entry?.externalUrl),
    })),
    "id"
  );

  const petInfoLibrary = await readJsonAbsolute(
    path.join(extraDirectory, "petInfoLibrary.json")
  );
  const petInfoAnimals = Array.isArray(petInfoLibrary)
    ? petInfoLibrary.map((group) => ({
        type: String(group?.type || "").trim(),
        imageUrl: normalizeMediaUrl(group?.imageUrl) || "",
        imageAlt: String(group?.imageAlt || "").trim(),
        summary: String(group?.summary || "").trim(),
        idealFor: String(group?.idealFor || "").trim(),
        commonNeeds: Array.isArray(group?.commonNeeds)
          ? group.commonNeeds.map((entry) => String(entry).trim()).filter(Boolean)
          : [],
      }))
    : [];
  const petInfoBreeds = [];
  let petInfoBreedIdFallback = 1;
  if (Array.isArray(petInfoLibrary)) {
    petInfoLibrary.forEach((group) => {
      const groupType = String(group?.type || "").trim();
      (group?.breeds || []).forEach((breed) => {
        const explicitId = Number(breed?.id);
        const id = Number.isFinite(explicitId) && explicitId > 0
          ? explicitId
          : petInfoBreedIdFallback;
        if (!explicitId || !Number.isFinite(explicitId) || explicitId <= 0) {
          petInfoBreedIdFallback += 1;
        }
        petInfoBreeds.push({
          id,
          type: groupType,
          name: String(breed?.name || "").trim(),
          imageUrl: normalizeMediaUrl(breed?.imageUrl) || "",
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
  }
  const petInfoAnimalsResult = await upsertMany(PetInfoAnimals, petInfoAnimals, "type");
  const petInfoBreedsResult = await upsertMany(PetInfoBreeds, petInfoBreeds, "id");

  const rawSiteSettings = await readJsonAbsolute(path.join(extraDirectory, "siteSettings.json"));
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

  console.log("Import complete.");
  console.log("Adoptable animals:", adoptableResult);
  console.log("Vet providers:", vetResult);
  console.log("Vet authors:", vetAuthorResult);
  console.log("Training programs:", trainingResult);
  console.log("Grooming programs:", groomingResult);
  console.log("Boarding programs:", boardingResult);
  console.log("Stories:", communityStoryResult);
  console.log("Blog posts:", blogPostsResult);
  console.log("Pet info animals:", petInfoAnimalsResult);
  console.log("Pet info breeds:", petInfoBreedsResult);
  console.log("Site settings:", siteSettingsResult);
};

seedFromExtra()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  });
