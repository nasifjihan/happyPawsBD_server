import express from "express";

import adoptionRoutes from "../../modules/adoption/adoption.routes.js";
import enrollmentRoutes from "../../modules/enrollments/enrollment.routes.js";
import lostFoundRoutes from "../../modules/lost-found/lost-found.routes.js";
import orderRoutes from "../../modules/orders/order.routes.js";
import paymentRoutes from "../../modules/payments/payment.routes.js";

const router = express.Router();

router.use("/lost-found", lostFoundRoutes);
router.use("/adoption", adoptionRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

export default router;
