import express from "express";
import { getVendorProfileController, updateVendorProfileController } from "../../controllers/vendor/vendorProfileController.js"
import { isVendorLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.get('/:id', isVendorLoginIn, getVendorProfileController)
router.put('/:id', isVendorLoginIn, updateVendorProfileController)

export default router