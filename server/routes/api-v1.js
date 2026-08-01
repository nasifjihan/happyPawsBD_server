import express from "express";

import adoptionRoutes from "../../modules/adoption/adoption.routes.js";
import adminRoutes from "../../modules/admin/admin.routes.js";
import catalogRoutes from "../../modules/catalog/catalog.routes.js";
import consultationRoutes from "../../modules/consultations/consultation.routes.js";
import enrollmentRoutes from "../../modules/enrollments/enrollment.routes.js";
import lostFoundRoutes from "../../modules/lost-found/lost-found.routes.js";
import orderRoutes from "../../modules/orders/order.routes.js";
import paymentRoutes from "../../modules/payments/payment.routes.js";
import programsRoutes from "../../modules/programs/programs.routes.js";
import reviewRoutes from "../../modules/reviews/review.routes.js";
import rescueAlertRoutes from "../../modules/rescue-alerts/rescue-alert.routes.js";
import storyRoutes from "../../modules/stories/story.routes.js";
import blogPostRoutes from "../../modules/blog-posts/blog-post.routes.js";
import petInfoRoutes from "../../modules/pet-info/pet-info.routes.js";
import siteSettingsRoutes from "../../modules/site-settings/site-settings.routes.js";
import vetAuthorsRoutes from "../../modules/vet-authors/vet-authors.routes.js";
import vetsRoutes from "../../modules/vets/vets.routes.js";
import volunteerRoutes from "../../modules/volunteers/volunteer.routes.js";

const router = express.Router();

router.use("/lost-found", lostFoundRoutes);
router.use("/adoption", adoptionRoutes);
router.use("/catalog", catalogRoutes);
router.use("/consultations", consultationRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/programs", programsRoutes);
router.use("/reviews", reviewRoutes);
router.use("/stories", storyRoutes);
router.use("/rescue-alerts", rescueAlertRoutes);
router.use("/blog-posts", blogPostRoutes);
router.use("/pet-info", petInfoRoutes);
router.use("/site-settings", siteSettingsRoutes);
router.use("/vet-authors", vetAuthorsRoutes);
router.use("/vets", vetsRoutes);
router.use("/volunteers", volunteerRoutes);
router.use("/volunteers", volunteerRoutes);
router.use("/admin", adminRoutes);

export default router;
