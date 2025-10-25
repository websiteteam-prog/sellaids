// routes/orderRoutes.js
import express from "express";
import {
  createOrderController,
  verifyPaymentController
} from "../../controllers/user/userOrderController.js";
import { isUserLoginIn } from "../../middlewares/authMiddlewares.js"

const router = express.Router();

// User routes
router.post("/create", isUserLoginIn, createOrderController);
router.post("/payment/verify", isUserLoginIn, verifyPaymentController); // body: { order_id, provider, provider_payment_id, amount }

// User summary
// router.get("/me/summary", getUserPaymentSummaryController);

// Vendor earnings
// router.get("/vendor/earnings/:vendorId?", getVendorEarningsController); // vendor auth or param

// Admin
// router.get("/admin/all", getOrdersForAdminController);

export default router;