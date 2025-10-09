import express from "express";
import { getAllVendorsController, vendorForgotPasswordController, vendorResetPasswordController } from "../../controllers/vendor/vendorController.js"

// define router object
const router = express.Router()

// define all routes
router.get('/vendors', getAllVendorsController)
router.post('/forgot-password', vendorForgotPasswordController)
router.post('/reset-password', vendorResetPasswordController)

export default router