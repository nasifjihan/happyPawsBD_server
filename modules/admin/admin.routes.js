import express from "express";

import {
  getAdoptionApplicationAdmin,
  adminLogin,
  deleteAdoptableAnimalAdmin,
  deleteShopItemAdmin,
  deleteProgramAdmin,
  deleteVetProviderAdmin,
  getSiteSettingsAdmin,
  getAdminSession,
  getOnlineConsultationAdmin,
  getOrderAdmin,
  getProgramAdmin,
  getReviewAdmin,
  getStoryAdmin,
  getVetProviderAdmin,
  getVolunteerApplicationAdmin,
  listAdoptionApplicationsAdmin,
  listAdoptableAnimalsAdmin,
  listEnrollmentsAdmin,
  listLostFoundAdmin,
  listOnlineConsultationsAdmin,
  listOrdersAdmin,
  listProgramsAdmin,
  listReviewsAdmin,
  listShopItemsAdmin,
  listStoriesAdmin,
  listVetProvidersAdmin,
  listVolunteerApplicationsAdmin,
  deleteStoryAdmin,
  updateAdoptionApplicationAdmin,
  updateAdminPassword,
  updateSiteSettingsAdmin,
  updateEnrollmentAdmin,
  updateLostFoundAdmin,
  updateOnlineConsultationAdmin,
  updateOrderAdmin,
  updateReviewAdmin,
  upsertProgramAdmin,
  upsertStoryAdmin,
  upsertVetProviderAdmin,
  updateVolunteerApplicationAdmin,
  upsertAdoptableAnimalAdmin,
  upsertShopItemAdmin,
} from "./admin.controller.js";
import { requireAdmin } from "./admin.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", requireAdmin, getAdminSession);
router.put("/credentials", requireAdmin, updateAdminPassword);
router.get("/settings/site", requireAdmin, getSiteSettingsAdmin);
router.put("/settings/site", requireAdmin, updateSiteSettingsAdmin);

router.get("/catalog/shop-items", requireAdmin, listShopItemsAdmin);
router.post("/catalog/shop-items", requireAdmin, upsertShopItemAdmin);
router.put("/catalog/shop-items/:id", requireAdmin, upsertShopItemAdmin);
router.delete("/catalog/shop-items/:id", requireAdmin, deleteShopItemAdmin);

router.get("/catalog/vets", requireAdmin, listVetProvidersAdmin);
router.get("/catalog/vets/:id", requireAdmin, getVetProviderAdmin);
router.post("/catalog/vets", requireAdmin, upsertVetProviderAdmin);
router.put("/catalog/vets/:id", requireAdmin, upsertVetProviderAdmin);
router.delete("/catalog/vets/:id", requireAdmin, deleteVetProviderAdmin);

router.get("/catalog/programs/:type", requireAdmin, listProgramsAdmin);
router.get("/catalog/programs/:type/:id", requireAdmin, getProgramAdmin);
router.post("/catalog/programs/:type", requireAdmin, upsertProgramAdmin);
router.put("/catalog/programs/:type/:id", requireAdmin, upsertProgramAdmin);
router.delete("/catalog/programs/:type/:id", requireAdmin, deleteProgramAdmin);

router.get("/content/stories", requireAdmin, listStoriesAdmin);
router.get("/content/stories/:id", requireAdmin, getStoryAdmin);
router.post("/content/stories", requireAdmin, upsertStoryAdmin);
router.put("/content/stories/:id", requireAdmin, upsertStoryAdmin);
router.delete("/content/stories/:id", requireAdmin, deleteStoryAdmin);

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

router.get(
  "/requests/consultations/online",
  requireAdmin,
  listOnlineConsultationsAdmin
);
router.get(
  "/requests/consultations/online/:id",
  requireAdmin,
  getOnlineConsultationAdmin
);
router.put(
  "/requests/consultations/online/:id",
  requireAdmin,
  updateOnlineConsultationAdmin
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

router.get("/requests/reviews", requireAdmin, listReviewsAdmin);
router.get("/requests/reviews/:id", requireAdmin, getReviewAdmin);
router.put("/requests/reviews/:id", requireAdmin, updateReviewAdmin);

export default router;
