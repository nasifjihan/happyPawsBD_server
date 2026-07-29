import { VetProviders } from "../../model/Schema.js";

export const listVetProviders = async ({
  page,
  limit,
  division,
  city,
  district,
  q,
}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (division) {
    filter.Division = division;
  }

  if (city) {
    filter.City = city;
  }

  if (district) {
    filter.District = district;
  }

  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { title: regex },
      { position: regex },
      { location: regex },
      { District: regex },
      { City: regex },
      { Division: regex },
    ];
  }

  const [items, total] = await Promise.all([
    VetProviders.find(filter).sort({ id: 1 }).skip(skip).limit(limit).lean(),
    VetProviders.countDocuments(filter),
  ]);

  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const getVetDirectoryMeta = async ({ division, city }) => {
  const allDivisions = await VetProviders.distinct("Division");
  const divisions = (allDivisions ?? [])
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)));

  let cities = [];
  let districts = [];

  if (division) {
    const result = await VetProviders.distinct("City", { Division: division });
    cities = (result ?? [])
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b)));
  }

  if (division && city) {
    const result = await VetProviders.distinct("District", {
      Division: division,
      City: city,
    });
    districts = (result ?? [])
      .filter(Boolean)
      .sort((a, b) => String(a).localeCompare(String(b)));
  }

  return { divisions, cities, districts };
};
