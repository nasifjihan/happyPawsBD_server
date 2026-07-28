import {
  validateFoundPetPayload,
  validateLostPetPayload,
} from "./lost-found.validation.js";
import {
  createFoundPetPost,
  createLostPetPost,
  listFoundPets,
  listLostPets,
} from "./lost-found.service.js";

const normalizePositiveInteger = (value, fallback) => {
  const normalizedValue = Number.parseInt(value, 10);

  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
};

const getPaginationOptions = (query) => ({
  page: normalizePositiveInteger(query.page, 1),
  limit: Math.min(normalizePositiveInteger(query.limit, 12), 50),
});

export const addLostPet = async (req, res, next) => {
  try {
    const lostPetData = validateLostPetPayload({
      ...req.body,
      petPicture: req.file?.path,
    });
    const savedLostPet = await createLostPetPost(lostPetData);
    res.status(201).json(savedLostPet);
  } catch (error) {
    next(error);
  }
};

export const getLostPets = async (req, res, next) => {
  try {
    const lostPets = await listLostPets(getPaginationOptions(req.query));
    res.status(200).json(lostPets);
  } catch (error) {
    next(error);
  }
};

export const addFoundPet = async (req, res, next) => {
  try {
    const foundPetData = validateFoundPetPayload({
      ...req.body,
      petPicture: req.file?.path,
    });
    const savedFoundPet = await createFoundPetPost(foundPetData);
    res.status(201).json(savedFoundPet);
  } catch (error) {
    next(error);
  }
};

export const getFoundPets = async (req, res, next) => {
  try {
    const foundPets = await listFoundPets(getPaginationOptions(req.query));
    res.status(200).json(foundPets);
  } catch (error) {
    next(error);
  }
};
