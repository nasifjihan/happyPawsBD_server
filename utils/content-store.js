import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const dataDirectory = path.resolve(currentDirectory, "../data");
const cache = new Map();

const getFilePath = (fileName) => path.join(dataDirectory, fileName);

const readJsonFile = async (fileName) => {
  const filePath = getFilePath(fileName);
  const fileStats = await stat(filePath);
  const cachedEntry = cache.get(filePath);

  if (cachedEntry?.mtimeMs === fileStats.mtimeMs) {
    return cachedEntry.data;
  }

  const rawContent = await readFile(filePath, "utf-8");
  const parsedContent = JSON.parse(rawContent);

  cache.set(filePath, {
    mtimeMs: fileStats.mtimeMs,
    data: parsedContent,
  });

  return parsedContent;
};

export const getAdoptableAnimals = async () =>
  readJsonFile("adoptableAnimals.json");
