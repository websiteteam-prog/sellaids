import express from "express";
import { getAllUsersController, userForgotPasswordController, userResetPasswordController } from "../../controllers/user/userController.js"

// define router object
const router = express.Router()

// define all routes
router.get('/users', getAllUsersController)
router.post('/forgot-password', userForgotPasswordController)
router.post('/reset-password', userResetPasswordController)

export default router