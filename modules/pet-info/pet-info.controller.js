import { buildPetInfoLibrary, listPetInfoAnimals } from "./pet-info.service.js";

export const getPetInfoAnimals = async (req, res, next) => {
  try {
    const animals = await listPetInfoAnimals();
    res.status(200).json({ items: animals });
  } catch (error) {
    next(error);
  }
};

export const getPetInfoLibrary = async (req, res, next) => {
  try {
    const type = req.query?.type ? String(req.query.type).trim() : "";
    const q = req.query?.q ? String(req.query.q).trim() : "";

    const result = await buildPetInfoLibrary({
      type: type || null,
      q: q || null,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
