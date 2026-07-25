import { PostFoundPet, PostLostPet } from "../../model/Schema.js";

export const createLostPetPost = async (payload) => {
  const lostPetPost = new PostLostPet(payload);
  return lostPetPost.save();
};

export const listLostPets = async () => PostLostPet.find();

export const createFoundPetPost = async (payload) => {
  const foundPetPost = new PostFoundPet(payload);
  return foundPetPost.save();
};

export const listFoundPets = async () => PostFoundPet.find();
