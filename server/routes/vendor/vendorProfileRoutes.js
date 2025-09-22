import express from "express";
import { getVendorProfileController, updateVendorProfileController } from "../../controllers/vendor/vendorProfileController.js"

// define router object
const router = express.Router()

// define all routes
router.get('/:id', getVendorProfileController)
router.put('/:id', updateVendorProfileController)

export default router