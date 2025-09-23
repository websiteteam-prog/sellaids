import express from "express";
import { adminForgotPasswordController, adminResetPasswordController } from "../../controllers/admin/adminController.js"
import { isAdminLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.post('/forgot-password', isAdminLoginIn, adminForgotPasswordController)
router.post('/reset-password', isAdminLoginIn, adminResetPasswordController)

export default router