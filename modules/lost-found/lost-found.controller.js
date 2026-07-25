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
    const lostPets = await listLostPets();
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
    const foundPets = await listFoundPets();
    res.status(200).json(foundPets);
  } catch (error) {
    next(error);
  }
};
