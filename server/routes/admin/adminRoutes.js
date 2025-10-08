import express from "express";
import { adminForgotPasswordController, adminResetPasswordController } from "../../controllers/admin/adminController.js"

// define router object
const router = express.Router()

// define all routes
router.post('/forgot-password', adminForgotPasswordController)
router.post('/reset-password', adminResetPasswordController)

export default router