import express from "express";
import { getAllVendorWatchlistProductController } from "../../controllers/vendor/vendorWatchlistController.js";
import { isVendorLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.get("/", isVendorLoginIn, getAllVendorWatchlistProductController);

export default router;