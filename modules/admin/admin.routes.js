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
  getHouseCallRequestAdmin,
  getInPersonConsultationAdmin,
  getOnlineConsultationAdmin,
  getOrderAdmin,
  getProgramAdmin,
  getReviewAdmin,
  getStoryAdmin,
  getBlogPostAdmin,
  getRescueAlertAdmin,
  getVetProviderAdmin,
  getVolunteerApplicationAdmin,
  listAdoptionApplicationsAdmin,
  listAdoptableAnimalsAdmin,
  listEnrollmentsAdmin,
  listLostFoundAdmin,
  listHouseCallRequestsAdmin,
  listInPersonConsultationsAdmin,
  listOnlineConsultationsAdmin,
  listOrdersAdmin,
  listProgramsAdmin,
  listReviewsAdmin,
  listShopItemsAdmin,
  listStoriesAdmin,
  listBlogPostsAdmin,
  listRescueAlertsAdmin,
  listVetProvidersAdmin,
  listVolunteerApplicationsAdmin,
  deleteStoryAdmin,
  deleteBlogPostAdmin,
  deletePetInfoAnimalAdmin,
  deletePetInfoBreedAdmin,
  updateAdoptionApplicationAdmin,
  updateAdminPassword,
  updateSiteSettingsAdmin,
  updateEnrollmentAdmin,
  updateHouseCallRequestAdmin,
  updateInPersonConsultationAdmin,
  updateLostFoundAdmin,
  updateOnlineConsultationAdmin,
  updateOrderAdmin,
  updateReviewAdmin,
  updateRescueAlertAdmin,
  upsertProgramAdmin,
  upsertStoryAdmin,
  upsertBlogPostAdmin,
  upsertPetInfoAnimalAdmin,
  upsertPetInfoBreedAdmin,
  upsertVetProviderAdmin,
  updateVolunteerApplicationAdmin,
  upsertAdoptableAnimalAdmin,
  upsertShopItemAdmin,
  listPetInfoAnimalsAdmin,
  listPetInfoBreedsAdmin,
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

router.get("/content/blog-posts", requireAdmin, listBlogPostsAdmin);
router.get("/content/blog-posts/:id", requireAdmin, getBlogPostAdmin);
router.post("/content/blog-posts", requireAdmin, upsertBlogPostAdmin);
router.put("/content/blog-posts/:id", requireAdmin, upsertBlogPostAdmin);
router.delete("/content/blog-posts/:id", requireAdmin, deleteBlogPostAdmin);

router.get("/content/pet-info/animals", requireAdmin, listPetInfoAnimalsAdmin);
router.post("/content/pet-info/animals", requireAdmin, upsertPetInfoAnimalAdmin);
router.delete(
  "/content/pet-info/animals/:type",
  requireAdmin,
  deletePetInfoAnimalAdmin
);

router.get("/content/pet-info/breeds", requireAdmin, listPetInfoBreedsAdmin);
router.post("/content/pet-info/breeds", requireAdmin, upsertPetInfoBreedAdmin);
router.put("/content/pet-info/breeds/:id", requireAdmin, upsertPetInfoBreedAdmin);
router.delete(
  "/content/pet-info/breeds/:id",
  requireAdmin,
  deletePetInfoBreedAdmin
);

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

router.get(
  "/requests/consultations/in-person",
  requireAdmin,
  listInPersonConsultationsAdmin
);
router.get(
  "/requests/consultations/in-person/:id",
  requireAdmin,
  getInPersonConsultationAdmin
);
router.put(
  "/requests/consultations/in-person/:id",
  requireAdmin,
  updateInPersonConsultationAdmin
);

router.get(
  "/requests/consultations/house-calls",
  requireAdmin,
  listHouseCallRequestsAdmin
);
router.get(
  "/requests/consultations/house-calls/:id",
  requireAdmin,
  getHouseCallRequestAdmin
);
router.put(
  "/requests/consultations/house-calls/:id",
  requireAdmin,
  updateHouseCallRequestAdmin
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

router.get("/requests/rescue-alerts", requireAdmin, listRescueAlertsAdmin);
router.get("/requests/rescue-alerts/:id", requireAdmin, getRescueAlertAdmin);
router.put("/requests/rescue-alerts/:id", requireAdmin, updateRescueAlertAdmin);

router.get("/requests/reviews", requireAdmin, listReviewsAdmin);
router.get("/requests/reviews/:id", requireAdmin, getReviewAdmin);
router.put("/requests/reviews/:id", requireAdmin, updateReviewAdmin);

export default router;
