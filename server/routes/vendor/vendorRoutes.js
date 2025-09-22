import express from "express";
import { vendorForgotPasswordController, vendorResetPasswordController } from "../../controllers/vendor/vendorController.js"

// define router object
const router = express.Router()

// define all routes
router.post('/forgot-password', vendorForgotPasswordController)
router.post('/reset-password', vendorResetPasswordController)

export default router