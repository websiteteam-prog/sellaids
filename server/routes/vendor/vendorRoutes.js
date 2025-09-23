import express from "express";
import { getAllVendorsController, vendorForgotPasswordController, vendorResetPasswordController } from "../../controllers/vendor/vendorController.js"
import { isVendorLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.get('/vendors', getAllVendorsController)
router.post('/forgot-password', isVendorLoginIn, vendorForgotPasswordController)
router.post('/reset-password', isVendorLoginIn, vendorResetPasswordController)

export default router