import {
  AdoptionApplication,
  AdoptableAnimals,
  BoardingEnrollment,
  GroomingEnrollment,
  Orders,
  InPersonConsultations,
  HouseCallRequests,
  OnlineConsultations,
  Reviews,
  CommunityStories,
  BlogPosts,
  PetInfoAnimals,
  PetInfoBreeds,
  RescueAlerts,
  PostFoundPet,
  PostLostPet,
  BoardingPrograms,
  GroomingPrograms,
  ShopItems,
  SiteSettings,
  TrainingPrograms,
  VetProviders,
  TrainingEnrollment,
  VolunteerApplication,
} from "../../model/Schema.js";
import { env } from "../../config/env.js";
import { createAdminToken } from "./admin.token.js";
import { updateAdminCredential, validateAdminLogin } from "./admin.service.js";

const normalizePositiveInteger = (value, fallback) => {
  const normalizedValue = Number.parseInt(value, 10);

  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
};

const getPagination = (query) => ({
  page: normalizePositiveInteger(query.page, 1),
  limit: Math.min(normalizePositiveInteger(query.limit, 20), 100),
});

const createPaginatedResult = async ({ model, page, limit, sort, filter = {} }) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
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

const normalizeMediaUrl = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  return String(value)
    .trim()
    .replace(/^["'`]+/, "")
    .replace(/["'`]+$/, "")
    .trim();
};

const escapeRegexSource = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createSearchRegex = (value) => new RegExp(escapeRegexSource(value), "i");

const getNextCommunityStoryId = async () => {
  const latest = await CommunityStories.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  return Number(latest?.id || 0) + 1;
};

const getNextBlogPostId = async () => {
  const latest = await BlogPosts.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  return Number(latest?.id || 0) + 1;
};

const getNextPetInfoBreedId = async () => {
  const latest = await PetInfoBreeds.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  return Number(latest?.id || 0) + 1;
};

export const adminLogin = async (req, res, next) => {
  try {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    if (!env.adminTokenSecret) {
      res.status(500).json({
        message: "Admin token secret is missing. Set ADMIN_TOKEN_SECRET.",
      });
      return;
    }

    const credential = await validateAdminLogin({ username, password });

    if (!credential) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = createAdminToken({
      secret: env.adminTokenSecret,
      username: credential.username,
    });

    res.status(200).json({ token, username: credential.username });
  } catch (error) {
    next(error);
  }
};

export const getAdminSession = async (req, res) => {
  res.status(200).json({ username: req.admin?.username });
};

export const updateAdminPassword = async (req, res, next) => {
  try {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    if (!username && !password) {
      res.status(400).json({
        message: "Provide a new username and/or password.",
      });
      return;
    }

    const updated = await updateAdminCredential({
      currentUsername: req.admin.username,
      username: username || null,
      password: password || null,
    });

    res.status(200).json({
      username: updated?.username || req.admin.username,
    });
  } catch (error) {
    next(error);
  }
};

export const getSiteSettingsAdmin = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "default" },
      { $setOnInsert: { key: "default" } },
      { upsert: true, new: true }
    ).lean();

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSiteSettingsAdmin = async (req, res, next) => {
  try {
    const payload = {
      brandName: req.body?.brandName ? String(req.body.brandName).trim() : "",
      contactEmail: req.body?.contactEmail
        ? String(req.body.contactEmail).trim()
        : "",
      contactPhone: req.body?.contactPhone
        ? String(req.body.contactPhone).trim()
        : "",
      whatsapp: req.body?.whatsapp ? String(req.body.whatsapp).trim() : "",
      address: req.body?.address ? String(req.body.address).trim() : "",
      city: req.body?.city ? String(req.body.city).trim() : "",
      mapUrl: req.body?.mapUrl ? String(req.body.mapUrl).trim() : "",
      mapEmbedUrl: req.body?.mapEmbedUrl ? String(req.body.mapEmbedUrl).trim() : "",
      facebookUrl: req.body?.facebookUrl ? String(req.body.facebookUrl).trim() : "",
      instagramUrl: req.body?.instagramUrl
        ? String(req.body.instagramUrl).trim()
        : "",
      youtubeUrl: req.body?.youtubeUrl ? String(req.body.youtubeUrl).trim() : "",
      donationBkashNumber: req.body?.donationBkashNumber
        ? String(req.body.donationBkashNumber).trim()
        : "",
      donationEmail: req.body?.donationEmail
        ? String(req.body.donationEmail).trim()
        : "",
      homeHeroBadge: req.body?.homeHeroBadge ? String(req.body.homeHeroBadge).trim() : "",
      homeHeroTitle: req.body?.homeHeroTitle ? String(req.body.homeHeroTitle).trim() : "",
      homeHeroSubtitle: req.body?.homeHeroSubtitle
        ? String(req.body.homeHeroSubtitle).trim()
        : "",
      homeHeroImageUrl: req.body?.homeHeroImageUrl
        ? normalizeMediaUrl(req.body.homeHeroImageUrl)
        : "",
      homeHeroImageAlt: req.body?.homeHeroImageAlt
        ? String(req.body.homeHeroImageAlt).trim()
        : "",
      homeAdoptedCount: req.body?.homeAdoptedCount
        ? String(req.body.homeAdoptedCount).trim()
        : "",
      homeAdoptedLabel: req.body?.homeAdoptedLabel
        ? String(req.body.homeAdoptedLabel).trim()
        : "",
    };

    const updated = await SiteSettings.findOneAndUpdate(
      { key: "default" },
      { $setOnInsert: { key: "default" }, $set: payload },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listShopItemsAdmin = async (req, res, next) => {
  try {
    const q = req.query?.q ? String(req.query.q).trim() : "";
    const filter = {};

    if (q) {
      const regex = createSearchRegex(q);
      const numericId = Number(q);
      filter.$or = [
        { name: regex },
        { category: regex },
        { brand: regex },
        { type: regex },
        { status: regex },
        { description: regex },
      ];

      if (Number.isFinite(numericId)) {
        filter.$or.push({ id: numericId });
      }
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: ShopItems,
      page,
      limit,
      sort: { id: 1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const upsertShopItemAdmin = async (req, res, next) => {
  try {
    const id = Number(req.body?.id ?? req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid item id is required." });
      return;
    }

    const nextPayload = {
      ...req.body,
      id,
      image: normalizeMediaUrl(req.body?.image),
    };

    const updated = await ShopItems.findOneAndUpdate(
      { id },
      { $set: nextPayload },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteShopItemAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid item id is required." });
      return;
    }

    const result = await ShopItems.deleteOne({ id });

    res.status(200).json({
      deleted: result.deletedCount === 1,
    });
  } catch (error) {
    next(error);
  }
};

export const listVetProvidersAdmin = async (req, res, next) => {
  try {
    const division = req.query?.division ? String(req.query.division).trim() : "";
    const city = req.query?.city ? String(req.query.city).trim() : "";
    const district = req.query?.district ? String(req.query.district).trim() : "";
    const q = req.query?.q ? String(req.query.q).trim() : "";
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
      const regex = createSearchRegex(q);
      filter.$or = [
        { title: regex },
        { position: regex },
        { Division: regex },
        { District: regex },
        { City: regex },
        { location: regex },
        { contact: regex },
        { email: regex },
        { services: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: VetProviders,
      page,
      limit,
      sort: { id: 1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getVetProviderAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid provider id is required." });
      return;
    }

    const provider = await VetProviders.findOne({ id }).lean();

    if (!provider) {
      res.status(404).json({ message: "Vet provider not found." });
      return;
    }

    res.status(200).json(provider);
  } catch (error) {
    next(error);
  }
};

export const upsertVetProviderAdmin = async (req, res, next) => {
  try {
    const id = Number(req.body?.id ?? req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid provider id is required." });
      return;
    }

    const nextPayload = {
      ...req.body,
      id,
      image: normalizeMediaUrl(req.body?.image),
    };

    const updated = await VetProviders.findOneAndUpdate(
      { id },
      { $set: nextPayload },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteVetProviderAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid provider id is required." });
      return;
    }

    const result = await VetProviders.deleteOne({ id });

    res.status(200).json({
      deleted: result.deletedCount === 1,
    });
  } catch (error) {
    next(error);
  }
};

const programModelForType = (type) => {
  if (type === "training") return TrainingPrograms;
  if (type === "grooming") return GroomingPrograms;
  if (type === "boarding") return BoardingPrograms;
  return null;
};

export const listProgramsAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "").trim();
    const model = programModelForType(type);

    if (!model) {
      res.status(404).json({ message: "Program type not found." });
      return;
    }

    const q = req.query?.q ? String(req.query.q).trim() : "";
    const filter = {};

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { title: regex },
        { shortDescription: regex },
        { description: regex },
        { dis1: regex },
        { dis2: regex },
        { dis3: regex },
        { duration: regex },
        { Duration: regex },
        { price: regex },
        { Price: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model,
      page,
      limit,
      sort: { id: 1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listStoriesAdmin = async (req, res, next) => {
  try {
    const allowedCategories = ["success", "remembrance", "community"];
    const allowedStatuses = ["new", "draft", "published", "rejected", "archived"];

    const category = req.query?.category ? String(req.query.category).trim() : "";
    const status = req.query?.status ? String(req.query.status).trim() : "";
    const q = req.query?.q ? String(req.query.q).trim() : "";
    const filter = {};

    if (category) {
      if (!allowedCategories.includes(category)) {
        res.status(400).json({ message: "Invalid category." });
        return;
      }
      filter.category = category;
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { story: regex },
        { authorName: regex },
        { petName: regex },
        { location: regex },
        { tags: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: CommunityStories,
      page,
      limit,
      sort: { featured: -1, createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStoryAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid story id is required." });
      return;
    }

    const story = await CommunityStories.findOne({ id }).lean();

    if (!story) {
      res.status(404).json({ message: "Story not found." });
      return;
    }

    res.status(200).json(story);
  } catch (error) {
    next(error);
  }
};

export const upsertStoryAdmin = async (req, res, next) => {
  try {
    const allowedCategories = ["success", "remembrance", "community"];
    const allowedStatuses = ["new", "draft", "published", "rejected", "archived"];

    const paramIdRaw = req.params?.id;
    if (paramIdRaw) {
      const parsed = Number(paramIdRaw);
      if (!Number.isFinite(parsed)) {
        res.status(400).json({ message: "Valid story id is required." });
        return;
      }
    }

    const bodyIdRaw = req.body?.id;
    const bodyId =
      bodyIdRaw !== undefined && bodyIdRaw !== null && bodyIdRaw !== ""
        ? Number(bodyIdRaw)
        : null;
    const paramId = paramIdRaw ? Number(paramIdRaw) : null;
    const id = Number.isFinite(bodyId)
      ? bodyId
      : Number.isFinite(paramId)
        ? paramId
        : await getNextCommunityStoryId();

    const category = req.body?.category ? String(req.body.category).trim() : "";
    if (!category || !allowedCategories.includes(category)) {
      res.status(400).json({ message: "Valid category is required." });
      return;
    }

    const status = req.body?.status ? String(req.body.status).trim() : "draft";
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const nextPayload = {
      ...req.body,
      id,
      category,
      status,
      title: req.body?.title ? String(req.body.title).trim() : "",
      excerpt: req.body?.excerpt ? String(req.body.excerpt).trim() : "",
      story: req.body?.story ? String(req.body.story).trim() : "",
      authorName: req.body?.authorName ? String(req.body.authorName).trim() : "",
      contactEmail: req.body?.contactEmail ? String(req.body.contactEmail).trim() : "",
      contactPhone: req.body?.contactPhone ? String(req.body.contactPhone).trim() : "",
      petName: req.body?.petName ? String(req.body.petName).trim() : "",
      location: req.body?.location ? String(req.body.location).trim() : "",
      image: normalizeMediaUrl(req.body?.image),
      tags: Array.isArray(req.body?.tags)
        ? req.body.tags.map((tag) => String(tag).trim()).filter(Boolean)
        : String(req.body?.tags || "")
            .split(/[\n,]+/g)
            .map((tag) => tag.trim())
            .filter(Boolean),
      featured: Boolean(req.body?.featured),
    };

    if (!nextPayload.title || !nextPayload.story) {
      res.status(400).json({ message: "Title and story are required." });
      return;
    }

    const updated = await CommunityStories.findOneAndUpdate(
      { id },
      { $set: nextPayload },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteStoryAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid story id is required." });
      return;
    }

    const result = await CommunityStories.deleteOne({ id });

    res.status(200).json({
      deleted: result.deletedCount === 1,
    });
  } catch (error) {
    next(error);
  }
};

export const listBlogPostsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["draft", "published", "archived"];

    const category = req.query?.category ? String(req.query.category).trim() : "";
    const status = req.query?.status ? String(req.query.status).trim() : "";
    const featured =
      req.query?.featured === "true" ||
      req.query?.featured === "1" ||
      req.query?.featured === "yes";
    const q = req.query?.q ? String(req.query.q).trim() : "";
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (featured) {
      filter.featured = true;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { content: regex },
        { authorName: regex },
        { category: regex },
        { tags: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: BlogPosts,
      page,
      limit,
      sort: { featured: -1, publishedAt: -1, createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBlogPostAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid blog post id is required." });
      return;
    }

    const post = await BlogPosts.findOne({ id }).lean();

    if (!post) {
      res.status(404).json({ message: "Blog post not found." });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const upsertBlogPostAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["draft", "published", "archived"];

    const paramIdRaw = req.params?.id;
    if (paramIdRaw) {
      const parsed = Number(paramIdRaw);
      if (!Number.isFinite(parsed)) {
        res.status(400).json({ message: "Valid blog post id is required." });
        return;
      }
    }

    const bodyIdRaw = req.body?.id;
    const bodyId =
      bodyIdRaw !== undefined && bodyIdRaw !== null && bodyIdRaw !== ""
        ? Number(bodyIdRaw)
        : null;
    const paramId = paramIdRaw ? Number(paramIdRaw) : null;
    const id = Number.isFinite(bodyId)
      ? bodyId
      : Number.isFinite(paramId)
        ? paramId
        : await getNextBlogPostId();

    const status = req.body?.status ? String(req.body.status).trim() : "draft";
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const publishedAtRaw = req.body?.publishedAt;
    const publishedAt =
      publishedAtRaw ? new Date(publishedAtRaw) : status === "published" ? new Date() : null;

    if (publishedAt && Number.isNaN(publishedAt.getTime())) {
      res.status(400).json({ message: "Invalid published date." });
      return;
    }

    const nextPayload = {
      ...req.body,
      id,
      status,
      category: req.body?.category ? String(req.body.category).trim() : "",
      title: req.body?.title ? String(req.body.title).trim() : "",
      excerpt: req.body?.excerpt ? String(req.body.excerpt).trim() : "",
      content: req.body?.content ? String(req.body.content).trim() : "",
      authorName: req.body?.authorName ? String(req.body.authorName).trim() : "",
      coverImageUrl: normalizeMediaUrl(req.body?.coverImageUrl),
      coverImageAlt: req.body?.coverImageAlt ? String(req.body.coverImageAlt).trim() : "",
      externalUrl: normalizeMediaUrl(req.body?.externalUrl),
      tags: Array.isArray(req.body?.tags)
        ? req.body.tags.map((tag) => String(tag).trim()).filter(Boolean)
        : String(req.body?.tags || "")
            .split(/[\n,]+/g)
            .map((tag) => tag.trim())
            .filter(Boolean),
      featured: Boolean(req.body?.featured),
      publishedAt,
    };

    if (!nextPayload.title || !nextPayload.content) {
      res.status(400).json({ message: "Title and content are required." });
      return;
    }

    const updated = await BlogPosts.findOneAndUpdate(
      { id },
      { $set: nextPayload },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPostAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid blog post id is required." });
      return;
    }

    const result = await BlogPosts.deleteOne({ id });

    res.status(200).json({
      deleted: result.deletedCount === 1,
    });
  } catch (error) {
    next(error);
  }
};

export const listPetInfoAnimalsAdmin = async (req, res, next) => {
  try {
    const q = req.query?.q ? String(req.query.q).trim() : "";
    const filter = {};

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [{ type: regex }, { summary: regex }, { idealFor: regex }, { commonNeeds: regex }];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: PetInfoAnimals,
      page,
      limit,
      sort: { type: 1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const upsertPetInfoAnimalAdmin = async (req, res, next) => {
  try {
    const type = req.body?.type ? String(req.body.type).trim() : "";

    if (!type) {
      res.status(400).json({ message: "Animal type is required." });
      return;
    }

    const summary = req.body?.summary ? String(req.body.summary).trim() : "";
    const idealFor = req.body?.idealFor ? String(req.body.idealFor).trim() : "";

    if (!summary || !idealFor) {
      res.status(400).json({ message: "Summary and ideal for fields are required." });
      return;
    }

    const commonNeeds = Array.isArray(req.body?.commonNeeds)
      ? req.body.commonNeeds.map((entry) => String(entry).trim()).filter(Boolean)
      : String(req.body?.commonNeeds || "")
          .split(/[\n,]+/g)
          .map((entry) => entry.trim())
          .filter(Boolean);

    const updated = await PetInfoAnimals.findOneAndUpdate(
      { type },
      { $set: { type, summary, idealFor, commonNeeds } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deletePetInfoAnimalAdmin = async (req, res, next) => {
  try {
    const type = req.params?.type ? String(req.params.type).trim() : "";

    if (!type) {
      res.status(400).json({ message: "Animal type is required." });
      return;
    }

    const [animalResult, breedResult] = await Promise.all([
      PetInfoAnimals.deleteOne({ type }),
      PetInfoBreeds.deleteMany({ type }),
    ]);

    res.status(200).json({
      deleted: animalResult.deletedCount === 1,
      deletedBreeds: breedResult.deletedCount || 0,
    });
  } catch (error) {
    next(error);
  }
};

export const listPetInfoBreedsAdmin = async (req, res, next) => {
  try {
    const type = req.query?.type ? String(req.query.type).trim() : "";
    const q = req.query?.q ? String(req.query.q).trim() : "";
    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
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

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: PetInfoBreeds,
      page,
      limit,
      sort: { type: 1, name: 1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const upsertPetInfoBreedAdmin = async (req, res, next) => {
  try {
    const paramIdRaw = req.params?.id;
    if (paramIdRaw) {
      const parsed = Number(paramIdRaw);
      if (!Number.isFinite(parsed)) {
        res.status(400).json({ message: "Valid breed id is required." });
        return;
      }
    }

    const bodyIdRaw = req.body?.id;
    const bodyId =
      bodyIdRaw !== undefined && bodyIdRaw !== null && bodyIdRaw !== ""
        ? Number(bodyIdRaw)
        : null;
    const paramId = paramIdRaw ? Number(paramIdRaw) : null;
    const id = Number.isFinite(bodyId)
      ? bodyId
      : Number.isFinite(paramId)
        ? paramId
        : await getNextPetInfoBreedId();

    const type = req.body?.type ? String(req.body.type).trim() : "";
    const name = req.body?.name ? String(req.body.name).trim() : "";

    if (!type || !name) {
      res.status(400).json({ message: "Animal type and breed name are required." });
      return;
    }

    const temperament = Array.isArray(req.body?.temperament)
      ? req.body.temperament.map((entry) => String(entry).trim()).filter(Boolean)
      : String(req.body?.temperament || "")
          .split(/[\n,]+/g)
          .map((entry) => entry.trim())
          .filter(Boolean);

    const nextPayload = {
      ...req.body,
      id,
      type,
      name,
      origin: req.body?.origin ? String(req.body.origin).trim() : "",
      size: req.body?.size ? String(req.body.size).trim() : "",
      lifespan: req.body?.lifespan ? String(req.body.lifespan).trim() : "",
      temperament,
      careLevel: req.body?.careLevel ? String(req.body.careLevel).trim() : "",
      exerciseNeeds: req.body?.exerciseNeeds ? String(req.body.exerciseNeeds).trim() : "",
      groomingNeeds: req.body?.groomingNeeds ? String(req.body.groomingNeeds).trim() : "",
      goodFor: req.body?.goodFor ? String(req.body.goodFor).trim() : "",
      highlights: req.body?.highlights ? String(req.body.highlights).trim() : "",
    };

    const updated = await PetInfoBreeds.findOneAndUpdate(
      { id },
      { $set: nextPayload },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deletePetInfoBreedAdmin = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid breed id is required." });
      return;
    }

    const result = await PetInfoBreeds.deleteOne({ id });

    res.status(200).json({
      deleted: result.deletedCount === 1,
    });
  } catch (error) {
    next(error);
  }
};

export const getProgramAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "").trim();
    const model = programModelForType(type);

    if (!model) {
      res.status(404).json({ message: "Program type not found." });
      return;
    }

    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid program id is required." });
      return;
    }

    const program = await model.findOne({ id }).lean();

    if (!program) {
      res.status(404).json({ message: "Program not found." });
      return;
    }

    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

export const upsertProgramAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "").trim();
    const model = programModelForType(type);

    if (!model) {
      res.status(404).json({ message: "Program type not found." });
      return;
    }

    const id = Number(req.body?.id ?? req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid program id is required." });
      return;
    }

    const nextPayload = {
      ...req.body,
      id,
      picture: normalizeMediaUrl(req.body?.picture),
    };

    const updated = await model.findOneAndUpdate(
      { id },
      { $set: nextPayload },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProgramAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "").trim();
    const model = programModelForType(type);

    if (!model) {
      res.status(404).json({ message: "Program type not found." });
      return;
    }

    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Valid program id is required." });
      return;
    }

    const result = await model.deleteOne({ id });

    res.status(200).json({
      deleted: result.deletedCount === 1,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdoptableAnimalsAdmin = async (req, res, next) => {
  try {
    const q = req.query?.q ? String(req.query.q).trim() : "";
    const filter = {};

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { code: regex },
        { name: regex },
        { species: regex },
        { breed: regex },
        { location: regex },
        { gender: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: AdoptableAnimals,
      page,
      limit,
      sort: { code: 1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const upsertAdoptableAnimalAdmin = async (req, res, next) => {
  try {
    const code = String(req.body?.code || req.params.code || "").trim();

    if (!code) {
      res.status(400).json({ message: "Animal code is required." });
      return;
    }

    const updated = await AdoptableAnimals.findOneAndUpdate(
      { code },
      { $set: { ...req.body, code } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteAdoptableAnimalAdmin = async (req, res, next) => {
  try {
    const code = String(req.params.code || "").trim();

    if (!code) {
      res.status(400).json({ message: "Animal code is required." });
      return;
    }

    const result = await AdoptableAnimals.deleteOne({ code });

    res.status(200).json({
      deleted: result.deletedCount === 1,
    });
  } catch (error) {
    next(error);
  }
};

export const listOrdersAdmin = async (req, res, next) => {
  try {
    const allowedOrderStatuses = [
      "created",
      "pending_payment",
      "checkout_started",
      "payment_setup_failed",
      "payment_failed",
      "paid",
      "cancelled",
    ];
    const allowedPaymentStatuses = ["unpaid", "paid", "failed", "cancelled"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.orderStatus) {
      const orderStatus = String(req.query.orderStatus);
      if (!allowedOrderStatuses.includes(orderStatus)) {
        res.status(400).json({ message: "Invalid order status." });
        return;
      }
      filter.orderStatus = orderStatus;
    }

    if (req.query?.paymentStatus) {
      const paymentStatus = String(req.query.paymentStatus);
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        res.status(400).json({ message: "Invalid payment status." });
        return;
      }
      filter.paymentStatus = paymentStatus;
    }

    if (q) {
      const regex = createSearchRegex(q);
      const regexSource = escapeRegexSource(q);
      filter.$or = [
        { "deliveryInfo.name": regex },
        { "deliveryInfo.email": regex },
        { "deliveryInfo.phone": regex },
        { "deliveryInfo.city": regex },
        { "deliveryInfo.state": regex },
        { "deliveryInfo.zip": regex },
        { "deliveryInfo.address": regex },
        { paymentMethod: regex },
        { publicToken: regex },
        { stripeCheckoutSessionId: regex },
        { "orderSummary.items.name": regex },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: regexSource,
              options: "i",
            },
          },
        },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: Orders,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrderAdmin = async (req, res, next) => {
  try {
    const order = await Orders.findById(req.params.id).lean();

    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderAdmin = async (req, res, next) => {
  try {
    const allowedOrderStatuses = [
      "created",
      "pending_payment",
      "checkout_started",
      "payment_setup_failed",
      "payment_failed",
      "paid",
      "cancelled",
    ];
    const allowedPaymentStatuses = ["unpaid", "paid", "failed", "cancelled"];
    const updates = {};

    if (req.body?.orderStatus) {
      const orderStatus = String(req.body.orderStatus);
      if (!allowedOrderStatuses.includes(orderStatus)) {
        res.status(400).json({ message: "Invalid order status." });
        return;
      }
      updates.orderStatus = orderStatus;
    }

    if (req.body?.paymentStatus) {
      const paymentStatus = String(req.body.paymentStatus);
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        res.status(400).json({ message: "Invalid payment status." });
        return;
      }
      updates.paymentStatus = paymentStatus;
    }

    if (!Object.keys(updates).length) {
      res.status(400).json({ message: "No updates provided." });
      return;
    }

    const updated = await Orders.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).lean();

    if (!updated) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listVolunteerApplicationsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "reviewed", "contacted", "closed"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { fullName: regex },
        { contactEmail: regex },
        { contactPhone: regex },
        { city: regex },
        { preferredRole: regex },
        { availability: regex },
        { motivation: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: VolunteerApplication,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getVolunteerApplicationAdmin = async (req, res, next) => {
  try {
    const application = await VolunteerApplication.findById(req.params.id).lean();

    if (!application) {
      res.status(404).json({ message: "Volunteer application not found." });
      return;
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerApplicationAdmin = async (req, res, next) => {
  try {
    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "reviewed", "contacted", "closed"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updated = await VolunteerApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      res.status(404).json({ message: "Volunteer application not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listAdoptionApplicationsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "reviewed", "contacted", "approved", "rejected", "closed"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { animalCode: regex },
        { animalType: regex },
        { adopterName: regex },
        { contactEmail: regex },
        { contactPhone: regex },
        { address: regex },
        { experience: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: AdoptionApplication,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAdoptionApplicationAdmin = async (req, res, next) => {
  try {
    const application = await AdoptionApplication.findById(req.params.id).lean();

    if (!application) {
      res.status(404).json({ message: "Adoption application not found." });
      return;
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateAdoptionApplicationAdmin = async (req, res, next) => {
  try {
    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "reviewed", "contacted", "approved", "rejected", "closed"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updated = await AdoptionApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      res.status(404).json({ message: "Adoption application not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listOnlineConsultationsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "reviewed", "confirmed", "completed", "cancelled"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { fullName: regex },
        { contactEmail: regex },
        { contactPhone: regex },
        { petType: regex },
        { petName: regex },
        { preferredDoctor: regex },
        { preferredSlot: regex },
        { concern: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: OnlineConsultations,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOnlineConsultationAdmin = async (req, res, next) => {
  try {
    const consultation = await OnlineConsultations.findById(req.params.id).lean();

    if (!consultation) {
      res.status(404).json({ message: "Online consultation not found." });
      return;
    }

    res.status(200).json(consultation);
  } catch (error) {
    next(error);
  }
};

export const updateOnlineConsultationAdmin = async (req, res, next) => {
  try {
    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "reviewed", "confirmed", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updates = {
      status,
    };

    if ("adminNotes" in req.body) {
      updates.adminNotes = String(req.body.adminNotes || "").trim();
    }

    const updated = await OnlineConsultations.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).lean();

    if (!updated) {
      res.status(404).json({ message: "Online consultation not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listInPersonConsultationsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "reviewed", "scheduled", "completed", "cancelled"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { fullName: regex },
        { contactEmail: regex },
        { contactPhone: regex },
        { petType: regex },
        { petName: regex },
        { city: regex },
        { address: regex },
        { preferredDate: regex },
        { preferredTime: regex },
        { concern: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: InPersonConsultations,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getInPersonConsultationAdmin = async (req, res, next) => {
  try {
    const consultation = await InPersonConsultations.findById(req.params.id).lean();

    if (!consultation) {
      res.status(404).json({ message: "In-person consultation not found." });
      return;
    }

    res.status(200).json(consultation);
  } catch (error) {
    next(error);
  }
};

export const updateInPersonConsultationAdmin = async (req, res, next) => {
  try {
    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "reviewed", "scheduled", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updates = {
      status,
    };

    if ("adminNotes" in req.body) {
      updates.adminNotes = String(req.body.adminNotes || "").trim();
    }

    const updated = await InPersonConsultations.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).lean();

    if (!updated) {
      res.status(404).json({ message: "In-person consultation not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listHouseCallRequestsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "reviewed", "dispatched", "completed", "cancelled"];
    const allowedUrgencies = ["low", "medium", "high"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (req.query?.urgency) {
      const urgency = String(req.query.urgency);
      if (!allowedUrgencies.includes(urgency)) {
        res.status(400).json({ message: "Invalid urgency." });
        return;
      }
      filter.urgency = urgency;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { fullName: regex },
        { contactEmail: regex },
        { contactPhone: regex },
        { petType: regex },
        { petName: regex },
        { city: regex },
        { address: regex },
        { preferredDate: regex },
        { preferredTime: regex },
        { concern: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: HouseCallRequests,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getHouseCallRequestAdmin = async (req, res, next) => {
  try {
    const request = await HouseCallRequests.findById(req.params.id).lean();

    if (!request) {
      res.status(404).json({ message: "House call request not found." });
      return;
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const updateHouseCallRequestAdmin = async (req, res, next) => {
  try {
    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "reviewed", "dispatched", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updates = {
      status,
    };

    if ("adminNotes" in req.body) {
      updates.adminNotes = String(req.body.adminNotes || "").trim();
    }

    const updated = await HouseCallRequests.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).lean();

    if (!updated) {
      res.status(404).json({ message: "House call request not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const enrollmentModels = {
  training: TrainingEnrollment,
  grooming: GroomingEnrollment,
  boarding: BoardingEnrollment,
};

export const listEnrollmentsAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "");
    const model = enrollmentModels[type];

    if (!model) {
      res.status(400).json({ message: "Invalid enrollment type." });
      return;
    }

    const allowedStatuses = ["new", "reviewed", "contacted", "scheduled", "closed"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { name: regex },
        { contactEmail: regex },
        { contactPhone: regex },
        { address: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateEnrollmentAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "");
    const model = enrollmentModels[type];

    if (!model) {
      res.status(400).json({ message: "Invalid enrollment type." });
      return;
    }

    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "reviewed", "contacted", "scheduled", "closed"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updated = await model.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();

    if (!updated) {
      res.status(404).json({ message: "Enrollment not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const lostFoundModels = {
  "lost-pets": PostLostPet,
  "found-pets": PostFoundPet,
};

export const listLostFoundAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "");
    const model = lostFoundModels[type];

    if (!model) {
      res.status(400).json({ message: "Invalid report type." });
      return;
    }

    const allowedStatuses = ["new", "reviewed", "resolved", "closed"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);

      filter.$or =
        type === "lost-pets"
          ? [
              { petName: regex },
              { animalType: regex },
              { colors: regex },
              { ownerName: regex },
              { contactPhone: regex },
              { contactEmail: regex },
              { lastSeenLocation: regex },
              { description: regex },
            ]
          : [
              { animalType: regex },
              { breed: regex },
              { colors: regex },
              { gender: regex },
              { founderName: regex },
              { contactPhone: regex },
              { contactEmail: regex },
              { foundLocation: regex },
              { description: regex },
            ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateLostFoundAdmin = async (req, res, next) => {
  try {
    const type = String(req.params.type || "");
    const model = lostFoundModels[type];

    if (!model) {
      res.status(400).json({ message: "Invalid report type." });
      return;
    }

    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "reviewed", "resolved", "closed"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updated = await model.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();

    if (!updated) {
      res.status(404).json({ message: "Report not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listRescueAlertsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "reviewing", "dispatched", "resolved", "archived"];
    const allowedUrgencies = ["low", "medium", "high", "critical"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (req.query?.urgency) {
      const urgency = String(req.query.urgency);
      if (!allowedUrgencies.includes(urgency)) {
        res.status(400).json({ message: "Invalid urgency." });
        return;
      }
      filter.urgency = urgency;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { reporterName: regex },
        { contactPhone: regex },
        { contactEmail: regex },
        { animalType: regex },
        { location: regex },
        { landmark: regex },
        { description: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: RescueAlerts,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRescueAlertAdmin = async (req, res, next) => {
  try {
    const alert = await RescueAlerts.findById(req.params.id).lean();

    if (!alert) {
      res.status(404).json({ message: "Rescue alert not found." });
      return;
    }

    res.status(200).json(alert);
  } catch (error) {
    next(error);
  }
};

export const updateRescueAlertAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "reviewing", "dispatched", "resolved", "archived"];
    const status = String(req.body?.status || "");

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updates = {
      status,
    };

    if ("adminNotes" in req.body) {
      updates.adminNotes = String(req.body.adminNotes || "").trim();
    }

    const updated = await RescueAlerts.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).lean();

    if (!updated) {
      res.status(404).json({ message: "Rescue alert not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const listReviewsAdmin = async (req, res, next) => {
  try {
    const allowedStatuses = ["new", "approved", "rejected"];
    const filter = {};
    const q = req.query?.q ? String(req.query.q).trim() : "";

    if (req.query?.status) {
      const status = String(req.query.status);
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
      }
      filter.status = status;
    }

    if (q) {
      const regex = createSearchRegex(q);
      filter.$or = [
        { fullName: regex },
        { contactEmail: regex },
        { title: regex },
        { message: regex },
      ];
    }

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: Reviews,
      page,
      limit,
      sort: { createdAt: -1 },
      filter,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getReviewAdmin = async (req, res, next) => {
  try {
    const review = await Reviews.findById(req.params.id).lean();

    if (!review) {
      res.status(404).json({ message: "Review not found." });
      return;
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

export const updateReviewAdmin = async (req, res, next) => {
  try {
    const status = String(req.body?.status || "");
    const allowedStatuses = ["new", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const updates = {
      status,
    };

    if ("adminNotes" in req.body) {
      updates.adminNotes = String(req.body.adminNotes || "").trim();
    }

    const updated = await Reviews.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).lean();

    if (!updated) {
      res.status(404).json({ message: "Review not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
