import express from "express";
import { createVendorProductController, getAllVendorProductController, getSingleVendorProductController, updateVendorProductController, deleteVendorProductController } from "../../controllers/vendor/vendorProductController.js"
import { isVendorLoginIn } from "../../middlewares/authmiddlewares.js"
import { uploadFields } from '../../middlewares/upload.js'

// define router objects
const router = express.Router();

// define all routes
router.post("/", isVendorLoginIn, uploadFields, createVendorProductController);
router.get("/", getAllVendorProductController);
router.get("/:productId", getSingleVendorProductController);
router.put("/:productId", isVendorLoginIn, updateVendorProductController);
router.delete("/:productId", isVendorLoginIn, deleteVendorProductController);

export default router;