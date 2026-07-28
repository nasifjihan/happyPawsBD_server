import express from "express";

import {
  getAdoptionApplicationAdmin,
  adminLogin,
  deleteAdoptableAnimalAdmin,
  deleteShopItemAdmin,
  getAdminSession,
  getOrderAdmin,
  getVolunteerApplicationAdmin,
  listAdoptionApplicationsAdmin,
  listAdoptableAnimalsAdmin,
  listEnrollmentsAdmin,
  listLostFoundAdmin,
  listOrdersAdmin,
  listShopItemsAdmin,
  listVolunteerApplicationsAdmin,
  updateAdoptionApplicationAdmin,
  updateAdminPassword,
  updateEnrollmentAdmin,
  updateLostFoundAdmin,
  updateOrderAdmin,
  updateVolunteerApplicationAdmin,
  upsertAdoptableAnimalAdmin,
  upsertShopItemAdmin,
} from "./admin.controller.js";
import { requireAdmin } from "./admin.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", requireAdmin, getAdminSession);
router.put("/credentials", requireAdmin, updateAdminPassword);

router.get("/catalog/shop-items", requireAdmin, listShopItemsAdmin);
router.post("/catalog/shop-items", requireAdmin, upsertShopItemAdmin);
router.put("/catalog/shop-items/:id", requireAdmin, upsertShopItemAdmin);
router.delete("/catalog/shop-items/:id", requireAdmin, deleteShopItemAdmin);

router.get("/adoption/animals", requireAdmin, listAdoptableAnimalsAdmin);
router.post("/adoption/animals", requireAdmin, upsertAdoptableAnimalAdmin);
router.put(
  "/adoption/animals/:code",
  requireAdmin,
  upsertAdoptableAnimalAdmin
);
router.delete(
  "/adoption/animals/:code",
  requireAdmin,
  deleteAdoptableAnimalAdmin
);

router.get("/orders", requireAdmin, listOrdersAdmin);
router.get("/orders/:id", requireAdmin, getOrderAdmin);
router.put("/orders/:id", requireAdmin, updateOrderAdmin);

router.get("/requests/volunteers", requireAdmin, listVolunteerApplicationsAdmin);
router.get(
  "/requests/volunteers/:id",
  requireAdmin,
  getVolunteerApplicationAdmin
);
router.put(
  "/requests/volunteers/:id",
  requireAdmin,
  updateVolunteerApplicationAdmin
);

router.get("/requests/adoptions", requireAdmin, listAdoptionApplicationsAdmin);
router.get(
  "/requests/adoptions/:id",
  requireAdmin,
  getAdoptionApplicationAdmin
);
router.put(
  "/requests/adoptions/:id",
  requireAdmin,
  updateAdoptionApplicationAdmin
);

router.get("/requests/enrollments/:type", requireAdmin, listEnrollmentsAdmin);
router.put(
  "/requests/enrollments/:type/:id",
  requireAdmin,
  updateEnrollmentAdmin
);

router.get("/requests/lost-found/:type", requireAdmin, listLostFoundAdmin);
router.put(
  "/requests/lost-found/:type/:id",
  requireAdmin,
  updateLostFoundAdmin
);

export default router;
