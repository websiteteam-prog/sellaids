import express from "express";
import { registerUserController, loginUserController, logoutUserController, googleLoginUserController } from "../../controllers/user/userAuthController.js"

// define router object
const router = express.Router()

// define all routes
router.post('/register', registerUserController)
router.post('/login', loginUserController)
router.post('/logout', logoutUserController)
router.post('/google-login', googleLoginUserController)

export default router