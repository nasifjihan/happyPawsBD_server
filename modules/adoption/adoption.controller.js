import { validateAdoptionPayload } from "./adoption.validation.js";
import {
  createAdoptionRecord,
  findAdoptableAnimalByCode,
  listAdoptableAnimals,
} from "./adoption.service.js";

export const addAdoptionApplication = async (req, res, next) => {
  try {
    const adoptionApplication = validateAdoptionPayload(
      req.body,
      req.params.code
    );
    const savedApplication = await createAdoptionRecord(adoptionApplication);
    res.status(201).json(savedApplication);
  } catch (error) {
    next(error);
  }
};

export const getAdoptableAnimals = async (req, res, next) => {
  try {
    const animals = await listAdoptableAnimals();
    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
};

export const getAdoptableAnimal = async (req, res, next) => {
  try {
    const animal = await findAdoptableAnimalByCode(req.params.code);

    if (!animal) {
      res.status(404).json({
        message: "Adoptable animal not found.",
      });
      return;
    }

    res.status(200).json(animal);
  } catch (error) {
    next(error);
  }
};
