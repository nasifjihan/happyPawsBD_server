import {
  BoardingPrograms,
  GroomingPrograms,
  TrainingPrograms,
} from "../../model/Schema.js";

const modelForType = (type) => {
  if (type === "training") return TrainingPrograms;
  if (type === "grooming") return GroomingPrograms;
  if (type === "boarding") return BoardingPrograms;
  return null;
};

export const listPrograms = async ({ type, page, limit, q }) => {
  const model = modelForType(type);
  if (!model) {
    return null;
  }

  const skip = (page - 1) * limit;
  const filter = {};

  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { title: regex },
      { dis1: regex },
      { dis2: regex },
      { dis3: regex },
      { description: regex },
      { shortDescription: regex },
      { duration: regex },
      { price: regex },
      { programCovers: regex },
    ];
  }

  const [items, total] = await Promise.all([
    model.find(filter).sort({ id: 1 }).skip(skip).limit(limit).lean(),
    model.countDocuments(filter),
  ]);

  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const getProgram = async ({ type, id }) => {
  const model = modelForType(type);
  if (!model) {
    return null;
  }

  return model.findOne({ id }).lean();
};

