import express from "express";
import { userForgotPasswordController, userResetPasswordController } from "../../controllers/user/userController.js"
import { isUserLoginIn } from "../../middlewares/authmiddlewares.js"

// define router object
const router = express.Router()

// define all routes
router.post('/forgot-password', isUserLoginIn, userForgotPasswordController)
router.post('/reset-password', isUserLoginIn, userResetPasswordController)

export default router