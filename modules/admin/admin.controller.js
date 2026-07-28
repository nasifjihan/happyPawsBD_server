import {
  AdoptionApplication,
  AdoptableAnimals,
  BoardingEnrollment,
  GroomingEnrollment,
  Orders,
  PostFoundPet,
  PostLostPet,
  ShopItems,
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

const createPaginatedResult = async ({ model, page, limit, sort }) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.find().sort(sort).skip(skip).limit(limit).lean(),
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

export const listShopItemsAdmin = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: ShopItems,
      page,
      limit,
      sort: { id: 1 },
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

    const updated = await ShopItems.findOneAndUpdate(
      { id },
      { $set: { ...req.body, id } },
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

export const listAdoptableAnimalsAdmin = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: AdoptableAnimals,
      page,
      limit,
      sort: { code: 1 },
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
    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: Orders,
      page,
      limit,
      sort: { createdAt: -1 },
    });
    res.status(200).json(result);
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
    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: VolunteerApplication,
      page,
      limit,
      sort: { createdAt: -1 },
    });
    res.status(200).json(result);
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
    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model: AdoptionApplication,
      page,
      limit,
      sort: { createdAt: -1 },
    });
    res.status(200).json(result);
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

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model,
      page,
      limit,
      sort: { createdAt: -1 },
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

    const { page, limit } = getPagination(req.query);
    const result = await createPaginatedResult({
      model,
      page,
      limit,
      sort: { createdAt: -1 },
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
