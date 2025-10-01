import express from "express";
import { createVendorProductController, getAllProductController, getSingleProductController, updateVendorProductController, deleteVendorProductController } from "../../controllers/vendor/vendorProductController.js"
import { isVendorLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router();

// define all routes
router.post("/", isVendorLoginIn, createVendorProductController);
router.get("/", getAllProductController);
router.get("/:productId", getSingleProductController);
router.put("/:productId", isVendorLoginIn, updateVendorProductController);
router.delete("/:productId", isVendorLoginIn, deleteVendorProductController);

export default router;