import { PetInfoAnimals, PetInfoBreeds } from "../../model/Schema.js";

const escapeRegexSource = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createSearchRegex = (value) => new RegExp(escapeRegexSource(value), "i");

export const listPetInfoAnimals = async () => {
  const items = await PetInfoAnimals.find({}).sort({ type: 1 }).lean();
  return items;
};

export const buildPetInfoLibrary = async ({ type, q } = {}) => {
  const animalFilter = {};
  const breedFilter = {};

  if (type) {
    animalFilter.type = type;
    breedFilter.type = type;
  }

  if (q) {
    const regex = createSearchRegex(q);
    breedFilter.$or = [
      { type: regex },
      { name: regex },
      { origin: regex },
      { size: regex },
      { lifespan: regex },
      { temperament: regex },
      { careLevel: regex },
      { exerciseNeeds: regex },
      { groomingNeeds: regex },
      { goodFor: regex },
      { highlights: regex },
    ];
  }

  const [animals, breeds] = await Promise.all([
    PetInfoAnimals.find(animalFilter).sort({ type: 1 }).lean(),
    PetInfoBreeds.find(breedFilter).sort({ type: 1, name: 1 }).lean(),
  ]);

  const animalByType = new Map(animals.map((item) => [item.type, item]));
  const grouped = new Map();

  breeds.forEach((breed) => {
    const groupType = breed.type;
    if (!grouped.has(groupType)) {
      const animalMeta = animalByType.get(groupType);
      grouped.set(groupType, {
        type: groupType,
        summary: animalMeta?.summary || "",
        idealFor: animalMeta?.idealFor || "",
        commonNeeds: animalMeta?.commonNeeds || [],
        imageUrl: animalMeta?.imageUrl || "",
        imageAlt: animalMeta?.imageAlt || "",
        breeds: [],
      });
    }
    grouped.get(groupType).breeds.push(breed);
  });

  const items = Array.from(grouped.values()).sort((a, b) =>
    String(a.type).localeCompare(String(b.type))
  );

  return {
    items,
    totalBreeds: breeds.length,
    totalGroups: items.length,
  };
};
