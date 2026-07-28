import { PostFoundPet, PostLostPet } from "../../model/Schema.js";

export const createLostPetPost = async (payload) => {
  const lostPetPost = new PostLostPet(payload);
  return lostPetPost.save();
};

const createPaginatedResult = async (model, page, limit) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    model.countDocuments(),
  ]);

  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const listLostPets = async ({ page, limit }) =>
  createPaginatedResult(PostLostPet, page, limit);

export const createFoundPetPost = async (payload) => {
  const foundPetPost = new PostFoundPet(payload);
  return foundPetPost.save();
};

export const listFoundPets = async ({ page, limit }) =>
  createPaginatedResult(PostFoundPet, page, limit);
